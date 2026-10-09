<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DonationStatusLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $notifications = $this->visibleEvents($user)
            ->whereNotIn('id', $user->read_notification_ids ?? [])
            ->with(['donation.user:id,name', 'donation.acceptedByNgo:id,name'])
            ->orderBy('id')
            ->limit(50)
            ->get()
            ->map(function (DonationStatusLog $event): array {
                $donation = $event->donation;

                return [
                    'id' => $event->id,
                    'donation_id' => $donation->id,
                    'kind' => $event->status,
                    'title' => match ($event->status) {
                        'published' => 'New donation published',
                        'assigned' => 'New pickup assigned',
                        'delivered' => 'Donation completed',
                    },
                    'message' => match ($event->status) {
                        'published' => "{$donation->user->name} published {$donation->food_type}. It is ready for an NGO to accept.",
                        'assigned' => ($donation->acceptedByNgo?->name ?? 'An NGO')." assigned you to collect {$donation->food_type} from {$donation->user->name}.",
                        'delivered' => "Your {$donation->food_type} donation was delivered successfully. Thank you for sharing!",
                    },
                    'created_at' => $event->created_at->toIso8601String(),
                ];
            });

        return response()->json(['role' => $user->role, 'notifications' => $notifications]);
    }

    public function markRead(Request $request): JsonResponse
    {
        $data = $request->validate([
            'ids' => ['required', 'array', 'min:1', 'max:500'],
            'ids.*' => ['required', 'integer', 'min:1', 'distinct'],
        ]);

        $readIds = DB::transaction(function () use ($request, $data): array {
            $user = User::query()->whereKey($request->user()->id)->lockForUpdate()->firstOrFail();
            $validIds = $this->visibleEvents($user)->whereIn('id', $data['ids'])->pluck('id')->all();
            $readIds = array_values(array_unique(array_merge($user->read_notification_ids ?? [], $validIds)));
            $user->forceFill(['read_notification_ids' => $readIds])->save();

            return $readIds;
        });

        return response()->json(['read_notification_ids' => $readIds]);
    }

    private function visibleEvents(User $user): Builder
    {
        $query = DonationStatusLog::query();

        if ($user->role === 'ngo') {
            return $query->where('status', 'published')->whereHas('donation', function (Builder $donations) use ($user): void {
                $donations->where('status', 'published')
                    ->where('pickup_deadline', '>', now())
                    ->whereDoesntHave('ngoRejections', fn (Builder $rejections) => $rejections->where('ngo_id', $user->id));
            });
        }

        if ($user->role === 'volunteer') {
            return $query->where('status', 'assigned')
                ->whereHas('changedBy', fn (Builder $users) => $users->where('role', 'ngo'))
                ->whereHas('donation', fn (Builder $donations) => $donations
                    ->where('assigned_volunteer_id', $user->id)
                    ->whereNotIn('status', ['delivered', 'cancelled']));
        }

        if (in_array($user->role, ['restaurant', 'household'])) {
            return $query->where('status', 'delivered')
                ->whereHas('donation', fn (Builder $donations) => $donations->where('user_id', $user->id));
        }

        return $query->whereRaw('1 = 0');
    }
}
