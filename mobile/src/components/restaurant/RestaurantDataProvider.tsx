import { isAxiosError } from 'axios';
import { router } from 'expo-router';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';

import { getApiErrorMessage } from '@/services/apiErrors';
import { createDonation, getDonation, getDonations } from '@/services/restaurantDonations';
import { removeToken } from '@/services/tokenStorage';
import type { Donation, DonationDraft } from '@/types/donation';

type RestaurantData = {
  donations: Donation[];
  isLoading: boolean;
  loadError: string | null;
  refreshDonations: () => Promise<void>;
  getDonationById: (id: string) => Promise<Donation>;
  publishDonation: (draft: DonationDraft) => Promise<Donation>;
  isPublishing: boolean;
};

const RestaurantDataContext = createContext<RestaurantData | null>(null);

function sortDonations(donations: Donation[]) {
  return donations.sort((a, b) =>
    (Date.parse(b.createdAt ?? '') || 0) - (Date.parse(a.createdAt ?? '') || 0));
}

export default function RestaurantDataProvider({ children }: PropsWithChildren) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const pendingPublish = useRef<Promise<Donation> | null>(null);
  const publishRevision = useRef(0);

  const handleUnauthorized = useCallback(async (error: unknown) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      await removeToken();
      router.replace('/login');
    }
  }, []);

  const refreshDonations = useCallback(async () => {
    const revisionAtStart = publishRevision.current;
    setIsLoading(true);
    setLoadError(null);
    try {
      const loaded = await getDonations();
      setDonations((current) => {
        if (revisionAtStart === publishRevision.current) return loaded;
        const loadedIds = new Set(loaded.map((donation) => donation.id));
        return sortDonations([...current.filter((donation) => !loadedIds.has(donation.id)), ...loaded]);
      });
    } catch (error) {
      setLoadError(getApiErrorMessage(error, 'load'));
      await handleUnauthorized(error);
    } finally {
      setIsLoading(false);
    }
  }, [handleUnauthorized]);

  useEffect(() => {
    const timer = setTimeout(() => { void refreshDonations(); }, 0);
    return () => clearTimeout(timer);
  }, [refreshDonations]);

  const getDonationById = useCallback(async (id: string) => {
    try {
      const donation = await getDonation(id);
      setDonations((current) => current.some((item) => item.id === id)
        ? sortDonations(current.map((item) => item.id === id ? donation : item))
        : sortDonations([donation, ...current]));
      return donation;
    } catch (error) {
      await handleUnauthorized(error);
      throw error;
    }
  }, [handleUnauthorized]);

  const publishDonation = useCallback((draft: DonationDraft) => {
    // A fast double tap shares the existing request instead of creating two records.
    if (pendingPublish.current) return pendingPublish.current;

    setIsPublishing(true);
    const request = createDonation(draft)
      .then((donation) => {
        publishRevision.current += 1;
        setDonations((current) => [donation, ...current]);
        return donation;
      })
      .catch(async (error) => {
        await handleUnauthorized(error);
        throw error;
      })
      .finally(() => {
        pendingPublish.current = null;
        setIsPublishing(false);
      });

    pendingPublish.current = request;
    return request;
  }, [handleUnauthorized]);

  const value = useMemo(
    () => ({ donations, isLoading, loadError, refreshDonations, getDonationById, publishDonation, isPublishing }),
    [donations, isLoading, loadError, refreshDonations, getDonationById, publishDonation, isPublishing],
  );

  return <RestaurantDataContext.Provider value={value}>{children}</RestaurantDataContext.Provider>;
}

export function useRestaurantData() {
  const context = useContext(RestaurantDataContext);
  if (!context) throw new Error('useRestaurantData must be used inside RestaurantDataProvider.');
  return context;
}
