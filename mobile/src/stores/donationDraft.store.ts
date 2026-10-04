import { create } from 'zustand';

import type { DonationDraft } from '@/types/donation';

type DonationDraftState = DonationDraft & {
  updateFoodDetails: (
    data: Partial<Pick<DonationDraft, 'foodType' | 'quantity' | 'unit' | 'description'>>
  ) => void;
  updatePickupDetails: (
    data: Partial<Pick<DonationDraft, 'pickupLocation' | 'pickupDeadline'>>
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
};

export const useDonationDraftStore = create<DonationDraftState>((set) => ({
  ...initialState,
  updateFoodDetails: (data) => set(data),
  updatePickupDetails: (data) => set(data),
  resetDraft: () => set(initialState),
}));
