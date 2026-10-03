import { create } from 'zustand';

type DonationDraftState = {
  foodType: string;
  quantity: string;
  unit: string;
  description: string;

  pickupLocation: string;
  pickupDeadline: string;

  updateFoodDetails: (data: {
    foodType?: string;
    quantity?: string;
    unit?: string;
    description?: string;
  }) => void;

  updatePickupDetails: (data: {
    pickupLocation?: string;
    pickupDeadline?: string;
  }) => void;

  resetDraft: () => void;
};

const initialState = {
  foodType: '',
  quantity: '',
  unit: 'portions',
  description: '',
  pickupLocation: '',
  pickupDeadline: '',
};

export const useDonationDraftStore =
  create<DonationDraftState>((set) => ({
    ...initialState,

    updateFoodDetails: (data) =>
      set((state) => ({
        ...state,
        ...data,
      })),

    updatePickupDetails: (data) =>
      set((state) => ({
        ...state,
        ...data,
      })),

    resetDraft: () => set(initialState),
  }));