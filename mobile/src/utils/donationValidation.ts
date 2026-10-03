import type { DonationDraft } from '@/types/donation';

export type FoodDetailsErrors = Partial<Record<'foodType' | 'quantity', string>>;
export type PickupDetailsErrors = Partial<Record<'pickupLocation' | 'pickupDeadline', string>>;

export function validateFoodDetails(
  draft: Pick<DonationDraft, 'foodType' | 'quantity'>
): FoodDetailsErrors {
  const errors: FoodDetailsErrors = {};

  if (!draft.foodType.trim()) {
    errors.foodType = 'Please enter the food type.';
  }

  if (!draft.quantity.trim()) {
    errors.quantity = 'Please enter the quantity.';
  } else if (!Number.isFinite(Number(draft.quantity)) || Number(draft.quantity) <= 0) {
    errors.quantity = 'Please enter a number greater than 0.';
  }

  return errors;
}

export function validatePickupDetails(
  draft: Pick<DonationDraft, 'pickupLocation' | 'pickupDeadline'>
): PickupDetailsErrors {
  const errors: PickupDetailsErrors = {};

  if (!draft.pickupLocation.trim()) {
    errors.pickupLocation = 'Please enter a pickup location.';
  }
  if (!draft.pickupDeadline.trim()) {
    errors.pickupDeadline = 'Please enter a pickup deadline.';
  }

  return errors;
}
