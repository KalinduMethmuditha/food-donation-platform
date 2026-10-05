import { api } from '@/services/api';
import type { Donation, DonationDraft } from '@/types/donation';

type ApiDonation = {
  id: number;
  food_type: string;
  quantity: string | number;
  unit: string;
  description: string | null;
  pickup_location: string;
  pickup_deadline: string;
  status: 'published';
};

export async function createDonation(draft: DonationDraft): Promise<Donation> {
  const quantity = Number(draft.quantity);

  if (!draft.foodType.trim() || !Number.isFinite(quantity) || quantity <= 0) {
    throw new Error('Enter a food type and a quantity greater than zero.');
  }

  if (!draft.pickupLocation.trim() || !draft.pickupDeadline.trim()) {
    throw new Error('Enter a pickup location and deadline.');
  }

  const { data } = await api.post<{ donation: ApiDonation }>('/donations', {
    food_type: draft.foodType.trim(),
    quantity,
    unit: draft.unit.trim() || 'portions',
    description: draft.description.trim(),
    pickup_location: draft.pickupLocation.trim(),
    pickup_deadline: draft.pickupDeadline.trim(),
  });

  const donation = data.donation;
  return {
    id: String(donation.id),
    foodType: donation.food_type,
    quantity: Number(donation.quantity),
    unit: donation.unit,
    description: donation.description ?? '',
    pickupLocation: donation.pickup_location,
    pickupDeadline: donation.pickup_deadline,
    status: donation.status,
  };
}
