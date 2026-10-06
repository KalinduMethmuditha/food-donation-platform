import { api } from '@/services/api';
import type { Donation, DonationDraft, DonationStatus } from '@/types/donation';
import { isValidPickupCoordinates, parsePickupCoordinate } from '@/utils/pickupCoordinates';

type ApiDonation = {
  id: number;
  food_type: string;
  quantity: string | number;
  unit: string;
  description: string | null;
  pickup_location: string;
  pickup_latitude?: number | string | null;
  pickup_longitude?: number | string | null;
  pickup_deadline: string;
  status: DonationStatus;
  created_at?: string;
  status_logs?: {
    id: number;
    status: DonationStatus;
    note: string | null;
    created_at: string;
  }[];
};

export function mapApiDonationToDonation(donation: ApiDonation): Donation {
  return {
    id: String(donation.id),
    foodType: donation.food_type,
    quantity: Number(donation.quantity),
    unit: donation.unit,
    description: donation.description ?? '',
    pickupLocation: donation.pickup_location,
    pickupLatitude: parsePickupCoordinate(donation.pickup_latitude, 90),
    pickupLongitude: parsePickupCoordinate(donation.pickup_longitude, 180),
    pickupDeadline: donation.pickup_deadline,
    status: donation.status,
    createdAt: donation.created_at,
    statusLogs: donation.status_logs?.map((log) => ({
      id: String(log.id),
      status: log.status,
      note: log.note ?? undefined,
      createdAt: log.created_at,
    })),
    collectedAt: donation.status_logs?.find((log) => log.status === 'collected')?.created_at,
  };
}

export async function getDonations(): Promise<Donation[]> {
  const { data } = await api.get<{ donations: ApiDonation[] }>('/donations');
  return data.donations.map(mapApiDonationToDonation);
}

export async function getDonation(id: string): Promise<Donation> {
  const { data } = await api.get<{ donation: ApiDonation }>(`/donations/${encodeURIComponent(id)}`);
  return mapApiDonationToDonation(data.donation);
}

export async function createDonation(draft: DonationDraft): Promise<Donation> {
  const quantity = Number(draft.quantity);

  if (!draft.foodType.trim() || !Number.isFinite(quantity) || quantity <= 0) {
    throw new Error('Enter a food type and a quantity greater than zero.');
  }

  if (!draft.pickupLocation.trim() || !draft.pickupDeadline.trim()) {
    throw new Error('Enter a pickup location and deadline.');
  }

  if ((draft.pickupLatitude !== undefined || draft.pickupLongitude !== undefined)
    && !isValidPickupCoordinates(draft.pickupLatitude, draft.pickupLongitude)) {
    throw new Error('Please select a valid pickup point.');
  }

  const { data } = await api.post<{ donation: ApiDonation }>('/donations', {
    food_type: draft.foodType.trim(),
    quantity,
    unit: draft.unit.trim() || 'portions',
    description: draft.description.trim(),
    pickup_location: draft.pickupLocation.trim(),
    pickup_latitude: draft.pickupLatitude,
    pickup_longitude: draft.pickupLongitude,
    pickup_deadline: draft.pickupDeadline.trim(),
  });

  return mapApiDonationToDonation(data.donation);
}
