import { api } from '@/services/api';
import type { UserRole } from '@/services/auth';

export type AccountNotification = {
  id: number;
  donation_id: number;
  kind: 'published' | 'assigned' | 'delivered';
  title: string;
  message: string;
  created_at: string;
};

export async function getUnreadNotifications(signal: AbortSignal) {
  const { data } = await api.get<{ role: UserRole; notifications: AccountNotification[] }>('/notifications', { signal });
  return data;
}

export async function markAccountNotificationsRead(ids: number[], signal: AbortSignal) {
  const { data } = await api.patch<{ read_notification_ids: number[] }>('/notifications/read', { ids }, { signal });
  return data.read_notification_ids;
}
