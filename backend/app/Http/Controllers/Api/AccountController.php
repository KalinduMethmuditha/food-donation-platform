<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class AccountController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $donations = match ($user->role) {
            'ngo' => $user->acceptedDonations(),
            'volunteer' => $user->assignedDonations(),
            default => $user->donations(),
        };

        return response()->json([
            'user' => $user,
            'statistics' => [
                'total' => (clone $donations)->count(),
                'active' => (clone $donations)->whereNotIn('status', ['delivered', 'cancelled'])->count(),
                'delivered' => (clone $donations)->where('status', 'delivered')->count(),
                'collected' => (clone $donations)->whereIn('status', ['collected', 'delivered'])->count(),
            ],
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($request->user()->id)],
            'phone' => ['nullable', 'string', 'max:30'],
            'location' => ['nullable', 'string', 'max:255'],
        ]);
        $request->user()->forceFill($data)->save();

        return response()->json(['user' => $request->user()->refresh()]);
    }

    public function preferences(Request $request): JsonResponse
    {
        $data = $request->validate(['generalNotifications' => ['required', 'boolean']]);
        $user = $request->user();
        $user->forceFill(['notification_preferences' => array_merge($user->notification_preferences ?? [], $data)])->save();

        return response()->json(['user' => $user->refresh()]);
    }

    public function uploadPhoto(Request $request): JsonResponse
    {
        $request->validate(['photo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048']]);
        $path = $request->file('photo')->store('avatars', 'local');
        abort_unless($path, 500, 'Could not save the profile photo.');
        try {
            $oldPath = DB::transaction(function () use ($request, $path): ?string {
                $user = User::query()->whereKey($request->user()->id)->lockForUpdate()->firstOrFail();
                $oldPath = $user->avatar_path;
                $user->forceFill(['avatar_path' => $path])->save();

                return $oldPath;
            });
        } catch (\Throwable $error) {
            Storage::disk('local')->delete($path);
            throw $error;
        }
        if ($oldPath) {
            Storage::disk('local')->delete($oldPath);
        }

        return response()->json(['user' => $request->user()->refresh()]);
    }

    public function removePhoto(Request $request): JsonResponse
    {
        $oldPath = DB::transaction(function () use ($request): ?string {
            $user = User::query()->whereKey($request->user()->id)->lockForUpdate()->firstOrFail();
            $path = $user->avatar_path;
            $user->forceFill(['avatar_path' => null])->save();

            return $path;
        });
        if ($oldPath) {
            Storage::disk('local')->delete($oldPath);
        }

        return response()->json(['user' => $request->user()->refresh()]);
    }

    public function photo(User $user): BinaryFileResponse
    {
        abort_unless($user->avatar_path && Storage::disk('local')->exists($user->avatar_path), 404);

        return response()->file(Storage::disk('local')->path($user->avatar_path));
    }

    public function support(Request $request): JsonResponse
    {
        $data = $request->validate([
            'type' => ['required', 'string', 'max:100'],
            'description' => ['required', 'string', 'min:10', 'max:2000'],
        ]);
        DB::table('volunteer_support_requests')->insert([
            ...$data, 'user_id' => $request->user()->id, 'created_at' => now(), 'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Your support request has been saved.'], 201);
    }

    public function destroy(Request $request): JsonResponse
    {
        $request->validate(['password' => ['required', 'current_password:sanctum']]);
        $result = DB::transaction(function () use ($request): array {
            $user = User::query()->whereKey($request->user()->id)->lockForUpdate()->firstOrFail();
            $active = $user->donations()->whereNotIn('status', ['delivered', 'cancelled'])->exists()
                || $user->acceptedDonations()->whereNotIn('status', ['delivered', 'cancelled'])->exists()
                || $user->assignedDonations()->whereNotIn('status', ['delivered', 'cancelled'])->exists();
            if ($active) {
                return ['blocked' => true];
            }
            $path = $user->avatar_path;
            $user->forceFill([
                'name' => 'Deleted account', 'email' => Str::uuid().'@deleted.invalid',
                'password' => Hash::make(Str::random(64)), 'phone' => null, 'location' => null,
                'avatar_path' => null, 'is_available' => false, 'pickup_preferences' => null,
                'notification_preferences' => null, 'read_notification_ids' => null, 'remember_token' => null,
            ])->save();
            $user->tokens()->delete();
            DB::table('volunteer_support_requests')->where('user_id', $user->id)->delete();
            $user->delete();

            return ['blocked' => false, 'path' => $path];
        });
        if ($result['blocked']) {
            return response()->json(['message' => 'Complete or cancel your active donations and pickups before deleting your account.'], 409);
        }
        if ($result['path']) {
            Storage::disk('local')->delete($result['path']);
        }

        return response()->json(['message' => 'Your account has been deleted.']);
    }
}
