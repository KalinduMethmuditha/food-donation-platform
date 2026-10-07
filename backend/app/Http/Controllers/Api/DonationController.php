<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDonationRequest;
use App\Models\Donation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DonationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $donations = $request->user()
            ->donations()
            ->with('statusLogs')
            ->latest()
            ->get();

        return response()->json([
            'donations' => $donations,
        ]);
    }

    public function store(StoreDonationRequest $request): JsonResponse
    {
        $user = $request->user();

        if (! in_array($user->role, ['restaurant', 'household'])) {
            return response()->json([
                'message' => 'Only donors can create donations.',
            ], 403);
        }

        $donation = DB::transaction(function () use ($request, $user) {
            $donation = $user->donations()->create([
                ...$request->validated(),
                'status' => 'published',
            ]);

            $donation->statusLogs()->create([
                'status' => 'published',
                'changed_by_user_id' => $user->id,
                'note' => 'Donation published.',
            ]);

            return $donation;
        });

        return response()->json([
            'message' => 'Donation published successfully.',
            'donation' => $donation->load('statusLogs'),
        ], 201);
    }

    public function show(Request $request, Donation $donation): JsonResponse
    {
        if ($donation->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'You are not allowed to view this donation.',
            ], 403);
        }

        return response()->json([
            'donation' => $donation->load('statusLogs'),
        ]);
    }

    public function update(StoreDonationRequest $request, Donation $donation): JsonResponse
    {
        if ($donation->user_id !== $request->user()->id ||
            ! in_array($request->user()->role, ['restaurant', 'household'])) {
            return response()->json(['message' => 'You are not allowed to edit this donation.'], 403);
        }

        if ($donation->status !== 'published') {
            return response()->json(['message' => 'Only published donations can be edited.'], 409);
        }

        $donation->update($request->validated());

        return response()->json([
            'message' => 'Donation updated successfully.',
            'donation' => $donation->refresh()->load('statusLogs'),
        ]);
    }

    public function destroy(Request $request, Donation $donation): JsonResponse
    {
        if ($donation->user_id !== $request->user()->id ||
            ! in_array($request->user()->role, ['restaurant', 'household'])) {
            return response()->json(['message' => 'You are not allowed to delete this donation.'], 403);
        }

        if ($donation->status !== 'published') {
            return response()->json(['message' => 'Only published donations can be deleted.'], 409);
        }

        $donation->delete();

        return response()->json(['message' => 'Donation deleted successfully.']);
    }
}
