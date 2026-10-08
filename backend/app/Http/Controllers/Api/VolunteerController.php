<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class VolunteerController extends Controller
{
    public function assignments(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'volunteer') {
            return response()->json(['message' => 'Only volunteers can view assignments.'], 403);
        }

        return response()->json([
            'is_available' => $request->user()->is_available,
            'read_notification_ids' => $request->user()->read_notification_ids ?? [],
            'donations' => $request->user()
                ->assignedDonations()
                ->with(['user:id,name,role', 'acceptedByNgo:id,name', 'statusLogs'])
                ->latest()
                ->get(),
        ]);
    }

    public function updateAvailability(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'volunteer') {
            return response()->json(['message' => 'Only volunteers can update availability.'], 403);
        }

        $data = $request->validate([
            'is_available' => ['required', 'boolean'],
        ]);

        $request->user()->forceFill(['is_available' => $data['is_available']])->save();

        return response()->json([
            'message' => 'Availability updated successfully.',
            'is_available' => $request->user()->is_available,
        ]);
    }

    public function updateStatus(Request $request, Donation $donation): JsonResponse
    {
        if ($request->user()->role !== 'volunteer' || $donation->assigned_volunteer_id !== $request->user()->id) {
            return response()->json(['message' => 'You are not assigned to this donation.'], 403);
        }

        $data = $request->validate([
            'status' => ['required', Rule::in(['pickup', 'arrived', 'collected', 'delivered'])],
        ]);

        return DB::transaction(function () use ($request, $donation, $data): JsonResponse {
            $locked = Donation::query()->whereKey($donation->id)->lockForUpdate()->firstOrFail();
            $transitions = [
                'assigned' => 'pickup',
                'pickup' => 'arrived',
                'arrived' => 'collected',
                'collected' => 'delivered',
            ];

            if (($transitions[$locked->status] ?? null) !== $data['status']) {
                return response()->json(['message' => 'Complete the previous pickup step first.'], 409);
            }

            $locked->forceFill(['status' => $data['status']])->save();
            $locked->statusLogs()->create([
                'status' => $data['status'],
                'changed_by_user_id' => $request->user()->id,
                'note' => match ($data['status']) {
                    'pickup' => 'Volunteer started the route.',
                    'arrived' => 'Volunteer arrived at pickup.',
                    'collected' => 'Food collected by volunteer.',
                    'delivered' => 'Food delivered by volunteer.',
                },
            ]);

            return response()->json([
                'donation' => $locked->refresh()->load(['user:id,name,role', 'acceptedByNgo:id,name', 'statusLogs']),
            ]);
        });
    }

    public function addUpdate(Request $request, Donation $donation): JsonResponse
    {
        if ($request->user()->role !== 'volunteer' || $donation->assigned_volunteer_id !== $request->user()->id) {
            return response()->json(['message' => 'You are not assigned to this donation.'], 403);
        }

        $data = $request->validate([
            'note' => ['required', 'string', 'max:500'],
        ]);

        if (! in_array($donation->status, ['assigned', 'pickup', 'arrived', 'collected'])) {
            return response()->json(['message' => 'This pickup cannot be updated.'], 409);
        }

        $donation->statusLogs()->create([
            'status' => $donation->status,
            'changed_by_user_id' => $request->user()->id,
            'note' => $data['note'],
        ]);

        return response()->json([
            'donation' => $donation->load(['user:id,name,role', 'acceptedByNgo:id,name', 'statusLogs']),
        ], 201);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'volunteer') {
            return response()->json(['message' => 'Only volunteers can update this profile.'], 403);
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($request->user()->id)],
            'phone' => ['nullable', 'string', 'max:30'],
            'location' => ['nullable', 'string', 'max:255'],
        ]);

        $request->user()->forceFill($data)->save();

        return response()->json(['user' => $request->user()->refresh()]);
    }

    public function updatePreferences(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'volunteer') {
            return response()->json(['message' => 'Only volunteers can update preferences.'], 403);
        }

        $data = $request->validate([
            'pickup_preferences' => ['sometimes', 'array'],
            'pickup_preferences.preferredStartTime' => ['sometimes', 'string', 'max:30'],
            'pickup_preferences.preferredEndTime' => ['sometimes', 'string', 'max:30'],
            'pickup_preferences.preferredArea' => ['sometimes', 'string', 'max:255'],
            'pickup_preferences.pickupRadius' => ['sometimes', 'string', 'max:30'],
            'pickup_preferences.availableToday' => ['sometimes', 'boolean'],
            'pickup_preferences.foodTypes' => ['sometimes', 'array'],
            'pickup_preferences.foodTypes.*' => ['string', 'max:100'],
            'pickup_preferences.availableDays' => ['sometimes', 'array'],
            'pickup_preferences.availableDays.*' => ['string', 'max:20'],
            'notification_preferences' => ['sometimes', 'array'],
            'notification_preferences.*' => ['boolean'],
        ]);

        $request->user()->forceFill($data)->save();

        return response()->json(['user' => $request->user()->refresh()]);
    }

    public function supportRequests(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'volunteer') {
            return response()->json(['message' => 'Only volunteers can view support requests.'], 403);
        }

        return response()->json([
            'requests' => DB::table('volunteer_support_requests')
                ->where('user_id', $request->user()->id)
                ->orderByDesc('created_at')
                ->get(['id', 'type', 'description', 'created_at']),
        ]);
    }

    public function createSupportRequest(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'volunteer') {
            return response()->json(['message' => 'Only volunteers can send support requests.'], 403);
        }

        $data = $request->validate([
            'type' => ['required', 'string', 'max:100'],
            'description' => ['required', 'string', 'min:10', 'max:2000'],
        ]);

        $id = DB::table('volunteer_support_requests')->insertGetId([
            ...$data,
            'user_id' => $request->user()->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['id' => $id, 'message' => 'Support request saved.'], 201);
    }

    public function markNotificationReads(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'volunteer') {
            return response()->json(['message' => 'Only volunteers can mark notifications read.'], 403);
        }

        $data = $request->validate([
            'ids' => ['required', 'array', 'max:500'],
            'ids.*' => ['required', 'integer', 'min:1'],
        ]);

        $validIds = DB::table('donation_status_logs')
            ->join('donations', 'donations.id', '=', 'donation_status_logs.donation_id')
            ->where('donations.assigned_volunteer_id', $request->user()->id)
            ->whereIn('donation_status_logs.id', $data['ids'])
            ->pluck('donation_status_logs.id')
            ->all();

        $readIds = array_slice(array_values(array_unique(array_merge(
            $request->user()->read_notification_ids ?? [], $validIds
        ))), -1000);
        $request->user()->forceFill(['read_notification_ids' => $readIds])->save();

        return response()->json(['read_notification_ids' => $readIds]);
    }
}
