<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VolunteerController extends Controller
{
    public function assignments(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'volunteer') {
            return response()->json(['message' => 'Only volunteers can view assignments.'], 403);
        }

        return response()->json([
            'is_available' => $request->user()->is_available,
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
}
