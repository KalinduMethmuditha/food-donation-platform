import type { DonationDraft } from '@/types/donation';
import { isValidPickupCoordinates } from '@/utils/pickupCoordinates';

export type FoodDetailsErrors = Partial<Record<'foodType' | 'quantity', string>>;
export type PickupDetailsErrors = Partial<Record<'pickupLocation' | 'pickupDeadline' | 'pickupCoordinates', string>>;

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
  draft: Pick<DonationDraft, 'pickupLocation' | 'pickupDeadline' | 'pickupLatitude' | 'pickupLongitude'>
): PickupDetailsErrors {
  const errors: PickupDetailsErrors = {};

  if ((draft.pickupLatitude !== undefined || draft.pickupLongitude !== undefined)
    && !isValidPickupCoordinates(draft.pickupLatitude, draft.pickupLongitude)) {
    errors.pickupCoordinates = 'Please select a valid pickup point on the map.';
  }

  if (!draft.pickupLocation.trim()) {
    errors.pickupLocation = 'Please enter a pickup location.';
  }
  if (!draft.pickupDeadline.trim()) {
    errors.pickupDeadline = 'Please enter a pickup deadline.';
  } else if (!Number.isFinite(Date.parse(draft.pickupDeadline)) || Date.parse(draft.pickupDeadline) <= Date.now()) {
    errors.pickupDeadline = 'Please select a future pickup date and time.';
  }

  return errors;
}
