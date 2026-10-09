<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use App\Models\NgoDonationRejection;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class NgoDonationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'ngo') {
            return response()->json(['message' => 'Only NGOs can view this feed.'], 403);
        }

        $availableDonations = Donation::query()
            ->where('status', 'published')
            ->where('pickup_deadline', '>', now())
            ->whereDoesntHave('ngoRejections', fn ($query) => $query->where('ngo_id', $request->user()->id))
            ->with('user:id,name,role')
            ->orderBy('pickup_deadline')
            ->get();

        $myDonations = $request->user()
            ->acceptedDonations()
            ->with(['user:id,name,role', 'assignedVolunteer:id,name', 'statusLogs'])
            ->latest()
            ->get();

        return response()->json([
            'available_donations' => $availableDonations,
            'my_donations' => $myDonations,
            'rejected_donations' => NgoDonationRejection::query()
                ->where('ngo_id', $request->user()->id)
                ->with('donation.user:id,name,role')
                ->latest()
                ->get(),
        ]);
    }

    public function show(Request $request, Donation $donation): JsonResponse
    {
        if ($request->user()->role !== 'ngo') {
            return response()->json(['message' => 'Only NGOs can view donations.'], 403);
        }

        $isAvailable = $donation->status === 'published' && $donation->pickup_deadline->isFuture();
        if (! $isAvailable && $donation->accepted_by_ngo_id !== $request->user()->id) {
            return response()->json(['message' => 'You are not allowed to view this donation.'], 403);
        }

        $donation->setAttribute('rejected_by_current_ngo', $donation->ngoRejections()->where('ngo_id', $request->user()->id)->exists());

        return response()->json([
            'donation' => $donation->load([
                'user:id,name,role',
                'acceptedByNgo:id,name',
                'assignedVolunteer:id,name',
                'statusLogs',
            ]),
        ]);
    }

    public function accept(Request $request, Donation $donation): JsonResponse
    {
        if ($request->user()->role !== 'ngo') {
            return response()->json(['message' => 'Only NGOs can accept donations.'], 403);
        }

        return DB::transaction(function () use ($request, $donation): JsonResponse {
            $lockedDonation = Donation::query()->whereKey($donation->id)->lockForUpdate()->firstOrFail();

            if ($lockedDonation->status !== 'published' || $lockedDonation->accepted_by_ngo_id !== null) {
                return response()->json(['message' => 'This donation is no longer available.'], 409);
            }

            if ($lockedDonation->pickup_deadline->isPast()) {
                return response()->json(['message' => 'The pickup deadline has passed.'], 409);
            }

            if ($lockedDonation->ngoRejections()->where('ngo_id', $request->user()->id)->exists()) {
                return response()->json(['message' => 'You already rejected this donation.'], 409);
            }

            $lockedDonation->forceFill([
                'accepted_by_ngo_id' => $request->user()->id,
                'status' => 'accepted',
            ])->save();

            $lockedDonation->statusLogs()->create([
                'status' => 'accepted',
                'changed_by_user_id' => $request->user()->id,
                'note' => 'Donation accepted by NGO.',
            ]);

            return response()->json([
                'message' => 'Donation accepted successfully.',
                'donation' => $lockedDonation->load([
                    'user:id,name,role',
                    'acceptedByNgo:id,name',
                    'statusLogs',
                ]),
            ]);
        });
    }

    public function reject(Request $request, Donation $donation): JsonResponse
    {
        if ($request->user()->role !== 'ngo') {
            return response()->json(['message' => 'Only NGOs can reject donations.'], 403);
        }

        return DB::transaction(function () use ($request, $donation): JsonResponse {
            $lockedDonation = Donation::query()->whereKey($donation->id)->lockForUpdate()->firstOrFail();

            if ($lockedDonation->status !== 'published' || $lockedDonation->accepted_by_ngo_id !== null || $lockedDonation->pickup_deadline->isPast()) {
                return response()->json(['message' => 'This donation is no longer available.'], 409);
            }

            $rejection = NgoDonationRejection::firstOrCreate([
                'donation_id' => $lockedDonation->id,
                'ngo_id' => $request->user()->id,
            ]);

            return response()->json([
                'message' => 'Donation rejected for your NGO.',
                'rejection' => $rejection->load('donation.user:id,name,role'),
            ]);
        });
    }

    public function volunteers(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'ngo') {
            return response()->json(['message' => 'Only NGOs can view available volunteers.'], 403);
        }

        return response()->json([
            'volunteers' => User::query()
                ->where('role', 'volunteer')
                ->where('is_available', true)
                ->orderBy('name')
                ->get(['id', 'name', 'is_available']),
        ]);
    }

    public function assign(Request $request, Donation $donation): JsonResponse
    {
        if ($request->user()->role !== 'ngo') {
            return response()->json(['message' => 'Only NGOs can assign volunteers.'], 403);
        }

        $data = $request->validate([
            'volunteer_id' => ['required', 'integer', 'exists:users,id'],
        ]);

        return DB::transaction(function () use ($request, $donation, $data): JsonResponse {
            $lockedDonation = Donation::query()->whereKey($donation->id)->lockForUpdate()->firstOrFail();

            if ($lockedDonation->accepted_by_ngo_id !== $request->user()->id) {
                return response()->json(['message' => 'You cannot assign this donation.'], 403);
            }

            if ($lockedDonation->status !== 'accepted') {
                return response()->json(['message' => 'This donation cannot be assigned.'], 409);
            }

            if ($lockedDonation->pickup_deadline->isPast()) {
                return response()->json(['message' => 'The pickup deadline has passed.'], 409);
            }

            $volunteer = User::query()->whereKey($data['volunteer_id'])->lockForUpdate()->first();
            if (! $volunteer || $volunteer->role !== 'volunteer' || ! $volunteer->is_available) {
                throw ValidationException::withMessages([
                    'volunteer_id' => ['Select an available volunteer.'],
                ]);
            }

            $lockedDonation->forceFill([
                'assigned_volunteer_id' => $volunteer->id,
                'status' => 'assigned',
            ])->save();

            $lockedDonation->statusLogs()->create([
                'status' => 'assigned',
                'changed_by_user_id' => $request->user()->id,
                'note' => 'Volunteer assigned.',
            ]);

            return response()->json([
                'message' => 'Volunteer assigned successfully.',
                'donation' => $lockedDonation->load([
                    'user:id,name,role',
                    'acceptedByNgo:id,name',
                    'assignedVolunteer:id,name',
                    'statusLogs',
                ]),
            ]);
        });
    }
}
