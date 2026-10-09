import type { IconName } from '@/components/ui/Icon';
import type { NgoDonation, NgoRejection } from '@/services/ngoDonations';

export const ngoCategories = ['All', 'Rice', 'Bread', 'Fruits', 'Vegetables'] as const;
export function foodVisual(food: string) {
  if (/rice|curry/i.test(food)) return { category: 'Rice', emoji: '🍛' };
  if (/bread|pastr|bakery|cake|bun/i.test(food)) return { category: 'Bread', emoji: '🥐' };
  if (/fruit|apple|banana|orange/i.test(food)) return { category: 'Fruits', emoji: '🍎' };
  if (/vegetable|carrot|potato|salad/i.test(food)) return { category: 'Vegetables', emoji: '🥕' };
  return { category: 'Food', emoji: '🍽️' };
}
export function initials(name: string) { return name.trim().split(/\s+/).map((part) => part[0] ?? '').join('').slice(0, 2).toUpperCase(); }
export function relativeTime(date?: string) {
  if (!date || !Number.isFinite(Date.parse(date))) return 'Time unavailable';
  const minutes = Math.max(0, Math.floor((Date.now() - Date.parse(date)) / 60000));
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)} hours ago`;
  return `${Math.floor(minutes / 1440)} days ago`;
}
export type NgoNotice = { id: string; donationId: string; title: string; detail: string; createdAt: string; available: boolean; rejected?: boolean; icon: IconName };
const statusTitles: Record<string, string> = { accepted: 'Donation accepted', assigned: 'Volunteer assigned', pickup: 'Pickup started', arrived: 'Volunteer arrived', collected: 'Item picked up', delivered: 'Collection completed', cancelled: 'Donation cancelled' };
const statusIcons: Record<string, IconName> = { accepted: 'check', assigned: 'user', pickup: 'truck', arrived: 'pin', collected: 'truck', delivered: 'check', cancelled: 'x-circle' };
export function ngoNotices(available: NgoDonation[], mine: NgoDonation[], rejected: NgoRejection[] = []): NgoNotice[] {
  return [
    ...available.map((item) => ({ id: `available-${item.id}`, donationId: item.id, title: 'New donation request', detail: `${item.foodType}, ${item.quantity} ${item.unit} · ${item.pickupLocation}`, createdAt: item.createdAt ?? '', available: true, icon: 'gift' as IconName })),
    ...mine.flatMap((item) => {
      const logs = item.statusLogs?.filter((log) => statusTitles[log.status]);
      return (logs?.length ? logs : [{ id: item.status, status: item.status, createdAt: item.createdAt ?? '', note: undefined }]).map((log) => ({ id: `status-${item.id}-${log.id}`, donationId: item.id, title: statusTitles[log.status] ?? 'Donation updated', detail: `${item.foodType} · ${log.note ?? item.volunteerName ?? item.donorName}`, createdAt: log.createdAt, available: false, icon: statusIcons[log.status] ?? 'info' }));
    }),
    ...rejected.map((item) => ({ id: `rejected-${item.id}`, donationId: item.donation.id, title: 'Donation rejected', detail: `${item.donation.foodType} (${item.donation.quantity} ${item.donation.unit}) was declined`, createdAt: item.createdAt, available: false, rejected: true, icon: 'x-circle' as IconName })),
  ].sort((a, b) => (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0));
}
