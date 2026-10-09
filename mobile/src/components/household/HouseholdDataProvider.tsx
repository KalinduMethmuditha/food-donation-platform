import { isAxiosError } from 'axios';
import { router } from 'expo-router';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';

import { getApiErrorMessage } from '@/services/apiErrors';
import {
  createDonation,
  deleteDonation as deleteApiDonation,
  getDonation,
  getDonations,
  updateDonation as updateApiDonation,
} from '@/services/donations';
import { removeToken } from '@/services/tokenStorage';
import type { Donation, DonationDraft } from '@/types/donation';

type HouseholdData = {
  donations: Donation[];
  isLoading: boolean;
  loadError: string | null;
  isSaving: boolean;
  refreshDonations: () => Promise<void>;
  getDonationById: (id: string) => Promise<Donation>;
  publishDonation: (draft: DonationDraft) => Promise<Donation>;
  updateDonation: (id: string, draft: DonationDraft) => Promise<Donation>;
  deleteDonation: (id: string) => Promise<void>;
};
const HouseholdDataContext = createContext<HouseholdData | null>(null);

function sortDonations(donations: Donation[]): Donation[] {
  return [...donations].sort((a, b) =>
    (Date.parse(b.createdAt ?? '') || 0) - (Date.parse(a.createdAt ?? '') || 0));
}

export default function HouseholdDataProvider({ children }: PropsWithChildren) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const mutationRevision = useRef(0);
  const pendingPublish = useRef<Promise<Donation> | null>(null);

  const handleUnauthorized = useCallback(async (error: unknown) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      await removeToken();
      router.replace('/login');
    }
  }, []);

  const refreshDonations = useCallback(async () => {
    const revision = mutationRevision.current;
    setIsLoading(true);
    setLoadError(null);
    try {
      const loaded = await getDonations();
      setDonations((current) => revision === mutationRevision.current ? sortDonations(loaded) : current);
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
      setDonations((current) => sortDonations([
        donation,
        ...current.filter((item) => item.id !== id),
      ]));
      return donation;
    } catch (error) {
      await handleUnauthorized(error);
      throw error;
    }
  }, [handleUnauthorized]);

  const publishDonation = useCallback((draft: DonationDraft) => {
    if (pendingPublish.current) return pendingPublish.current;
    setIsSaving(true);
    const request = createDonation(draft)
      .then((donation) => {
        mutationRevision.current += 1;
        setDonations((current) => sortDonations([donation, ...current]));
        return donation;
      })
      .catch(async (error) => { await handleUnauthorized(error); throw error; })
      .finally(() => { pendingPublish.current = null; setIsSaving(false); });
    pendingPublish.current = request;
    return request;
  }, [handleUnauthorized]);

  const updateDonation = useCallback(async (id: string, draft: DonationDraft) => {
    setIsSaving(true);
    try {
      const updated = await updateApiDonation(id, draft);
      mutationRevision.current += 1;
      setDonations((current) => sortDonations([updated, ...current.filter((item) => item.id !== id)]));
      return updated;
    } catch (error) {
      await handleUnauthorized(error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [handleUnauthorized]);

  const deleteDonation = useCallback(async (id: string) => {
    setIsSaving(true);
    try {
      await deleteApiDonation(id);
      mutationRevision.current += 1;
      setDonations((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      await handleUnauthorized(error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [handleUnauthorized]);

  const value = useMemo(() => ({
    donations, isLoading, loadError, isSaving,
    refreshDonations, getDonationById, publishDonation, updateDonation, deleteDonation,
  }), [donations, isLoading, loadError, isSaving, refreshDonations, getDonationById,
    publishDonation, updateDonation, deleteDonation]);
  return <HouseholdDataContext.Provider value={value}>{children}</HouseholdDataContext.Provider>;
}

export function useHouseholdData() {
  const context = useContext(HouseholdDataContext);
  if (!context) throw new Error('useHouseholdData must be used inside HouseholdDataProvider.');
  return context;
}
