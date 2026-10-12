import { create } from 'zustand';

import type { Donation, DonationDraft } from '@/types/donation';

type DonationDraftState = DonationDraft & {
  editingDonationId?: string;
  loadDraftFromDonation: (donation: Donation) => void;
  updateFoodDetails: (
    data: Partial<Pick<DonationDraft, 'foodType' | 'quantity' | 'unit' | 'description'>>
  ) => void;
  updatePickupDetails: (
    data: Partial<Pick<DonationDraft, 'pickupLocation' | 'pickupDeadline' | 'pickupLatitude' | 'pickupLongitude'>>
  ) => void;
  resetDraft: () => void;
};

const initialState: DonationDraft = {
  foodType: '',
  quantity: '',
  unit: 'portions',
  description: '',
  pickupLocation: '',
  pickupDeadline: '',
  pickupLatitude: undefined,
  pickupLongitude: undefined,
};

export const useDonationDraftStore = create<DonationDraftState>((set) => ({
  ...initialState,
  editingDonationId: undefined,
  loadDraftFromDonation: (donation) => set({
    editingDonationId: donation.id,
    foodType: donation.foodType,
    quantity: String(donation.quantity),
    unit: donation.unit,
    description: donation.description,
    pickupLocation: donation.pickupLocation,
    pickupLatitude: donation.pickupLatitude,
    pickupLongitude: donation.pickupLongitude,
    pickupDeadline: donation.pickupDeadline,
  }),
  updateFoodDetails: (data) => set(data),
  updatePickupDetails: (data) => set(data),
  resetDraft: () => set({ ...initialState, editingDonationId: undefined }),
}));
