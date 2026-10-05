import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { simulatePublishDonation } from '@/services/restaurantDonations';
import type { Donation, DonationDraft } from '@/types/donation';

const initialDonations: Donation[] = [{
  id: 'household-1',
  foodType: 'Vegetable Meals',
  quantity: 5,
  unit: 'portions',
  description: 'Packed in clean microwaveable containers.',
  pickupLocation: '123 Maple Street, Apartment 4B',
  pickupDeadline: 'Today, 8:00 PM',
  status: 'assigned',
  ngoName: 'City Harvest Alliance',
  volunteerName: 'David Miller',
}, {
  id: 'household-2',
  foodType: 'Cooked Rice',
  quantity: 3.5,
  unit: 'kg',
  description: 'Vegetarian meal portions.',
  pickupLocation: '123 Maple Street, Apartment 4B',
  pickupDeadline: 'Sept 17, 2026',
  status: 'collected',
  collectedAt: 'Sept 17, 2026 · 2:45 PM',
  ngoName: 'City Harvest Alliance',
  volunteerName: 'David Miller',
}];

type HouseholdData = {
  donations: Donation[];
  publishDonation: (draft: DonationDraft) => Promise<Donation>;
  updateDonation: (id: string, draft: DonationDraft) => Promise<Donation>;
  deleteDonation: (id: string) => void;
};
const HouseholdDataContext = createContext<HouseholdData | null>(null);

export default function HouseholdDataProvider({ children }: PropsWithChildren) {
  const [donations, setDonations] = useState(initialDonations);
  const publishDonation = useCallback(async (draft: DonationDraft) => {
    const donation = await simulatePublishDonation(draft);
    setDonations((current) => [donation, ...current]);
    return donation;
  }, []);
  const updateDonation = useCallback(async (id: string, draft: DonationDraft) => {
    const quantity = Number(draft.quantity);
    if (!draft.foodType.trim() || !Number.isFinite(quantity) || quantity <= 0 || !draft.pickupLocation.trim() || !draft.pickupDeadline.trim()) {
      throw new Error('Complete all donation details before saving.');
    }
    const updated = { ...donations.find((item) => item.id === id), ...draft, quantity, foodType: draft.foodType.trim(), pickupLocation: draft.pickupLocation.trim(), pickupDeadline: draft.pickupDeadline.trim(), description: draft.description.trim() } as Donation;
    setDonations((current) => current.map((item) => item.id === id ? updated : item));
    return updated;
  }, [donations]);
  const deleteDonation = useCallback((id: string) => {
    setDonations((current) => current.filter((item) => item.id !== id));
  }, []);
  const value = useMemo(() => ({ donations, publishDonation, updateDonation, deleteDonation }), [donations, publishDonation, updateDonation, deleteDonation]);
  return <HouseholdDataContext.Provider value={value}>{children}</HouseholdDataContext.Provider>;
}

export function useHouseholdData() {
  const context = useContext(HouseholdDataContext);
  if (!context) throw new Error('useHouseholdData must be used inside HouseholdDataProvider.');
  return context;
}
