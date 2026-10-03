import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';

import { mockDonations } from '@/data/mockRestaurantData';
import { simulatePublishDonation } from '@/services/restaurantDonations';
import type { Donation, DonationDraft } from '@/types/donation';

type RestaurantData = {
  donations: Donation[];
  publishDonation: (draft: DonationDraft) => Promise<Donation>;
  isPublishing: boolean;
};

const RestaurantDataContext = createContext<RestaurantData | null>(null);

/** Session-only demo records; the donation form continues to use its Zustand store. */
export default function RestaurantDataProvider({ children }: PropsWithChildren) {
  const [donations, setDonations] = useState<Donation[]>(mockDonations);
  const [isPublishing, setIsPublishing] = useState(false);
  const pendingPublish = useRef<Promise<Donation> | null>(null);

  const publishDonation = useCallback((draft: DonationDraft) => {
    // A fast double tap shares the existing request instead of creating two records.
    if (pendingPublish.current) return pendingPublish.current;

    setIsPublishing(true);
    const request = simulatePublishDonation(draft)
      .then((donation) => {
        setDonations((current) => [donation, ...current]);
        return donation;
      })
      .finally(() => {
        pendingPublish.current = null;
        setIsPublishing(false);
      });

    pendingPublish.current = request;
    return request;
  }, []);

  const value = useMemo(
    () => ({ donations, publishDonation, isPublishing }),
    [donations, publishDonation, isPublishing],
  );

  return <RestaurantDataContext.Provider value={value}>{children}</RestaurantDataContext.Provider>;
}

export function useRestaurantData() {
  const context = useContext(RestaurantDataContext);
  if (!context) throw new Error('useRestaurantData must be used inside RestaurantDataProvider.');
  return context;
}
