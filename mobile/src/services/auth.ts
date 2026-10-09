import { api } from '@/services/api';
import {
  removeToken,
  saveToken,
} from '@/services/tokenStorage';
import { useVolunteerStore, type NotificationPreferences, type PickupPreferences } from '@/store/volunteerStore';
import { useVolunteerAssignments } from '@/store/volunteerAssignments.store';
import { useNgoDonations } from '@/store/ngoDonations.store';
import { useAccountStore } from '@/store/account.store';

export type UserRole =
  | 'restaurant'
  | 'household'
  | 'ngo'
  | 'volunteer';

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at?: string;
  phone?: string | null;
  location?: string | null;
  avatar_url?: string | null;
  pickup_preferences?: Partial<PickupPreferences> | null;
  notification_preferences?: Partial<NotificationPreferences> | null;
};

export function syncAccount(user: AuthUser): AuthUser {
  user = { ...user, avatar_url: user.avatar_url ? new URL(user.avatar_url, api.defaults.baseURL).toString() : null };
  useAccountStore.getState().setUser(user);
  if (user.role === 'volunteer') {
    useVolunteerStore.getState().setAuthenticatedVolunteer(user);
  }
  return user;
}

type AuthResponse = {
  message: string;
  user: AuthUser;
  token: string;
};

export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/login', {
    email,
    password,
  });

  await saveToken(data.token);
  useVolunteerAssignments.getState().clear();
  useNgoDonations.getState().clear();
  data.user = syncAccount(data.user);

  return data;
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  role: UserRole;
}): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/register', {
    name: input.name,
    email: input.email,
    password: input.password,

    // Laravel's `confirmed` validation expects this exact name.
    password_confirmation: input.passwordConfirmation,

    role: input.role,
  });

  await saveToken(data.token);
  useVolunteerAssignments.getState().clear();
  useNgoDonations.getState().clear();
  data.user = syncAccount(data.user);

  return data;
}

export async function getCurrentUser(): Promise<AuthUser> {
  const { data } = await api.get<{ user: AuthUser }>('/me');

  return syncAccount(data.user);
}

export async function logoutUser() {
  try {
    await api.post('/logout');
  } finally {
    await removeToken();
    useAccountStore.getState().setUser(null);
    useVolunteerAssignments.getState().clear();
    useNgoDonations.getState().clear();
  }
}

export async function updateVolunteerProfile(input: { name: string; email: string; phone: string; location: string }) {
  const { data } = await api.patch<{ user: AuthUser }>('/volunteer/profile', input);
  return syncAccount(data.user);
}

export async function updateVolunteerPreferences(input: {
  pickup_preferences?: Partial<PickupPreferences>;
  notification_preferences?: Partial<NotificationPreferences>;
}) {
  const { data } = await api.patch<{ user: AuthUser }>('/volunteer/preferences', input);
  return syncAccount(data.user);
}
