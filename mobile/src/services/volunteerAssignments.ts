import { api } from '@/services/api';
import type { DonationStatus } from '@/types/donation';
import { parsePickupCoordinate } from '@/utils/pickupCoordinates';

export type VolunteerAssignment = {
  id: string;
  donorName: string;
  donorRole: string;
  ngoName?: string;
  foodType: string;
  quantity: number;
  unit: string;
  description: string;
  pickupLocation: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  pickupDeadline: string;
  status: DonationStatus;
  createdAt: string;
  statusLogs: { id: string; status: DonationStatus; note?: string; createdAt: string }[];
};

type ApiAssignment = {
  id: number;
  user?: { name: string; role: string };
  accepted_by_ngo?: { name: string } | null;
  food_type: string;
  quantity: number | string;
  unit: string;
  description: string | null;
  pickup_location: string;
  pickup_latitude?: number | string | null;
  pickup_longitude?: number | string | null;
  pickup_deadline: string;
  status: DonationStatus;
  created_at: string;
  status_logs?: { id: number; status: DonationStatus; note?: string | null; created_at: string }[];
};

function mapAssignment(item: ApiAssignment): VolunteerAssignment {
  return {
    id: String(item.id),
    donorName: item.user?.name ?? 'Donor',
    donorRole: item.user?.role ?? 'donor',
    ngoName: item.accepted_by_ngo?.name,
    foodType: item.food_type,
    quantity: Number(item.quantity),
    unit: item.unit,
    description: item.description ?? '',
    pickupLocation: item.pickup_location,
    pickupLatitude: parsePickupCoordinate(item.pickup_latitude, 90),
    pickupLongitude: parsePickupCoordinate(item.pickup_longitude, 180),
    pickupDeadline: item.pickup_deadline,
    status: item.status,
    createdAt: item.created_at,
    statusLogs: (item.status_logs ?? []).map((log) => ({
      id: String(log.id), status: log.status, note: log.note ?? undefined, createdAt: log.created_at,
    })).sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt)),
  };
}

export async function getVolunteerAssignments() {
  const { data } = await api.get<{ is_available: boolean; read_notification_ids: number[]; donations: ApiAssignment[] }>('/volunteer/assignments');
  return { isAvailable: data.is_available, readNotificationIds: data.read_notification_ids ?? [], assignments: data.donations.map(mapAssignment) };
}

export async function markVolunteerNotificationsRead(ids: number[]): Promise<number[]> {
  const { data } = await api.patch<{ read_notification_ids: number[] }>('/volunteer/notification-reads', { ids });
  return data.read_notification_ids;
}

export async function updateVolunteerAssignmentStatus(id: string, status: 'pickup' | 'arrived' | 'collected' | 'delivered') {
  const { data } = await api.patch<{ donation: ApiAssignment }>(`/volunteer/assignments/${encodeURIComponent(id)}/status`, { status });
  return mapAssignment(data.donation);
}

export async function addVolunteerAssignmentUpdate(id: string, note: string) {
  const { data } = await api.post<{ donation: ApiAssignment }>(`/volunteer/assignments/${encodeURIComponent(id)}/updates`, { note });
  return mapAssignment(data.donation);
}

export async function updateVolunteerAvailability(isAvailable: boolean) {
  const { data } = await api.patch<{ is_available: boolean }>('/volunteer/availability', { is_available: isAvailable });
  return data.is_available;
}
