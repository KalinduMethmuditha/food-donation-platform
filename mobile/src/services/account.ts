import { Platform } from 'react-native';
import type { ImagePickerAsset } from 'expo-image-picker';
import { api } from '@/services/api';
import { syncAccount, type AuthUser } from '@/services/auth';
import { removeToken } from '@/services/tokenStorage';
import { useAccountStore } from '@/store/account.store';
import { useVolunteerAssignments } from '@/store/volunteerAssignments.store';
import { useNgoDonations } from '@/store/ngoDonations.store';

export type AccountStatistics = { total: number; active: number; delivered: number; collected: number };
export async function getAccountProfile(signal?: AbortSignal) {
  const { data } = await api.get<{ user: AuthUser; statistics: AccountStatistics }>('/account/profile', { signal });
  return { ...data, user: syncAccount(data.user) };
}
export async function updateAccountProfile(input: { name: string; email: string; phone: string; location: string }) {
  const { data } = await api.patch<{ user: AuthUser }>('/account/profile', input);
  return syncAccount(data.user);
}
export async function setAccountNotifications(generalNotifications: boolean) {
  const { data } = await api.patch<{ user: AuthUser }>('/account/preferences', { generalNotifications });
  return syncAccount(data.user);
}
export async function uploadProfilePhoto(asset: ImagePickerAsset) {
  const form = new FormData();
  if (Platform.OS === 'web') {
    const file = asset.file ?? await (await fetch(asset.uri)).blob();
    form.append('photo', file, asset.fileName ?? 'profile.jpg');
  } else {
    form.append('photo', { uri: asset.uri, name: asset.fileName ?? 'profile.jpg', type: asset.mimeType ?? 'image/jpeg' } as unknown as Blob);
  }
  const { data } = await api.post<{ user: AuthUser }>('/account/photo', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return syncAccount(data.user);
}
export async function removeProfilePhoto() {
  const { data } = await api.delete<{ user: AuthUser }>('/account/photo');
  return syncAccount(data.user);
}
export async function deleteAccount(password: string) {
  await api.delete('/account', { data: { password } });
  await removeToken();
  useAccountStore.getState().setUser(null);
  useVolunteerAssignments.getState().clear();
  useNgoDonations.getState().clear();
}
export async function sendAccountSupportRequest(description: string) {
  await api.post('/account/support-requests', { type: 'Account support', description });
}
