import type { Donation, DonationDraft } from '@/types/donation';

let localDonationSequence = 0;

/** Frontend-only simulation. Replace this function with POST /api/donations later. */
export async function simulatePublishDonation(draft: DonationDraft): Promise<Donation> {
  const quantity = Number(draft.quantity);

  if (!draft.foodType.trim() || !Number.isFinite(quantity) || quantity <= 0) {
    throw new Error('Enter a food type and a quantity greater than zero.');
  }

  if (!draft.pickupLocation.trim() || !draft.pickupDeadline.trim()) {
    throw new Error('Enter a pickup location and deadline.');
  }

  // Capture the submitted values before the simulated request completes.
  const donation: Donation = {
    id: `local-${Date.now()}-${++localDonationSequence}`,
    foodType: draft.foodType.trim(),
    quantity,
    unit: draft.unit.trim() || 'portions',
    description: draft.description.trim(),
    pickupLocation: draft.pickupLocation.trim(),
    pickupDeadline: draft.pickupDeadline.trim(),
    status: 'published',
  };

  await new Promise<void>((resolve) => setTimeout(resolve, 500));
  return donation;
}
