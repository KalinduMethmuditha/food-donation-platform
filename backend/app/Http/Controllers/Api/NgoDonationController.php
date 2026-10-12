<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use App\Models\NgoDonationRejection;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
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
            'volunteer_acceptance_deadline' => ['required', 'date', 'after:now'],
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

            if (Carbon::parse($data['volunteer_acceptance_deadline'])->greaterThan($lockedDonation->pickup_deadline)) {
                throw ValidationException::withMessages(['volunteer_acceptance_deadline' => ['Accept-before time must be no later than the pickup deadline.']]);
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
                'volunteer_acceptance_deadline' => $data['volunteer_acceptance_deadline'],
                'volunteer_accepted_at' => null,
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

    public function updateAssignment(Request $request, Donation $donation): JsonResponse
    {
        if ($request->user()->role !== 'ngo') {
            return response()->json(['message' => 'Only NGOs can edit assignments.'], 403);
        }
        $data = $request->validate(['volunteer_acceptance_deadline' => ['required', 'date', 'after:now']]);

        return DB::transaction(function () use ($request, $donation, $data): JsonResponse {
            $locked = Donation::query()->whereKey($donation->id)->lockForUpdate()->firstOrFail();
            if ($locked->accepted_by_ngo_id !== $request->user()->id) {
                return response()->json(['message' => 'You cannot edit this assignment.'], 403);
            }
            if ($locked->status !== 'assigned' || $locked->volunteer_accepted_at !== null) {
                return response()->json(['message' => 'Only assignments awaiting volunteer acceptance can be edited.'], 409);
            }
            if (Carbon::parse($data['volunteer_acceptance_deadline'])->greaterThan($locked->pickup_deadline)) {
                throw ValidationException::withMessages(['volunteer_acceptance_deadline' => ['Accept-before time must be no later than the pickup deadline.']]);
            }
            $locked->forceFill($data)->save();

            return response()->json(['donation' => $locked->load(['user:id,name,role', 'assignedVolunteer:id,name', 'statusLogs'])]);
        });
    }

    public function cancelAssignment(Request $request, Donation $donation): JsonResponse
    {
        if ($request->user()->role !== 'ngo') {
            return response()->json(['message' => 'Only NGOs can cancel assignments.'], 403);
        }

        return DB::transaction(function () use ($request, $donation): JsonResponse {
            $locked = Donation::query()->whereKey($donation->id)->lockForUpdate()->firstOrFail();
            if ($locked->accepted_by_ngo_id !== $request->user()->id) {
                return response()->json(['message' => 'You cannot cancel this assignment.'], 403);
            }
            if ($locked->status !== 'assigned' || $locked->volunteer_accepted_at !== null) {
                return response()->json(['message' => 'Only assignments awaiting volunteer acceptance can be cancelled.'], 409);
            }
            $locked->forceFill([
                'assigned_volunteer_id' => null, 'volunteer_acceptance_deadline' => null,
                'volunteer_accepted_at' => null, 'status' => 'accepted',
            ])->save();
            $locked->statusLogs()->create([
                'status' => 'accepted', 'changed_by_user_id' => $request->user()->id,
                'note' => 'NGO cancelled the unaccepted volunteer assignment. Ready for reassignment.',
            ]);

            return response()->json(['donation' => $locked->load(['user:id,name,role', 'assignedVolunteer:id,name', 'statusLogs'])]);
        });
    }
}
