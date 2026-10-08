import { isAxiosError } from 'axios';
import { router } from 'expo-router';
import { create } from 'zustand';

import { getApiErrorMessage } from '@/services/apiErrors';
import {
  acceptNgoDonation,
  assignNgoVolunteer,
  getAvailableVolunteers,
  getNgoDonation,
  getNgoDonations,
  type AvailableVolunteer,
  type NgoDonation,
} from '@/services/ngoDonations';
import { removeToken } from '@/services/tokenStorage';

type State = {
  available: NgoDonation[];
  mine: NgoDonation[];
  volunteers: AvailableVolunteer[];
  readNoticeIds: string[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  loadDonation: (id: string) => Promise<NgoDonation>;
  loadVolunteers: () => Promise<void>;
  accept: (id: string) => Promise<NgoDonation>;
  assign: (id: string, volunteerId: string) => Promise<NgoDonation>;
  markNoticesRead: (ids: string[]) => void;
  clear: () => void;
};

function errorMessage(error: unknown): string {
  if (isAxiosError<{ message?: string; errors?: Record<string, string[]> }>(error)) {
    const firstValidationError = Object.values(error.response?.data?.errors ?? {})[0]?.[0];
    return firstValidationError ?? error.response?.data?.message ?? getApiErrorMessage(error, 'load');
  }
  return getApiErrorMessage(error, 'load');
}

async function handleUnauthorized(error: unknown) {
  if (isAxiosError(error) && error.response?.status === 401) {
    await removeToken();
    router.replace('/login');
  }
}

function upsertDonation(items: NgoDonation[], updated: NgoDonation) {
  return items.some((item) => item.id === updated.id)
    ? items.map((item) => item.id === updated.id ? updated : item)
    : [updated, ...items];
}

let revision = 0;
let requestId = 0;

export const useNgoDonations = create<State>((set, get) => ({
  available: [],
  mine: [],
  volunteers: [],
  readNoticeIds: [],
  isLoading: false,
  isSaving: false,
  error: null,
  clear: () => {
    revision += 1;
    requestId += 1;
    set({ available: [], mine: [], volunteers: [], readNoticeIds: [], isLoading: false, isSaving: false, error: null });
  },
  markNoticesRead: (ids) => set((state) => ({
    readNoticeIds: Array.from(new Set([...state.readNoticeIds, ...ids])),
  })),
  refresh: async () => {
    const currentRequest = ++requestId;
    const currentRevision = revision;
    set({ isLoading: true, error: null });
    try {
      const result = await getNgoDonations();
      if (currentRequest === requestId && currentRevision === revision) {
        set((state) => ({
          available: result.available,
          mine: result.mine.map((item) => {
            const previous = state.mine.find((old) => old.id === item.id);
            return previous?.status === item.status ? { ...item, statusLogs: previous.statusLogs } : item;
          }),
        }));
      }
    } catch (error) {
      if (currentRequest === requestId) set({ error: errorMessage(error) });
      await handleUnauthorized(error);
    } finally {
      if (currentRequest === requestId) set({ isLoading: false });
    }
  },
  loadDonation: async (id) => {
    try {
      const donation = await getNgoDonation(id);
      set((state) => donation.status === 'published'
        ? {
          available: upsertDonation(state.available, donation),
          mine: state.mine.filter((item) => item.id !== id),
        }
        : {
          available: state.available.filter((item) => item.id !== id),
          mine: upsertDonation(state.mine, donation),
        });
      return donation;
    } catch (error) {
      set({ error: errorMessage(error) });
      await handleUnauthorized(error);
      throw error;
    }
  },
  loadVolunteers: async () => {
    try {
      const volunteers = await getAvailableVolunteers();
      set({ volunteers, error: null });
    } catch (error) {
      set({ error: errorMessage(error) });
      await handleUnauthorized(error);
      throw error;
    }
  },
  accept: async (id) => {
    if (get().isSaving) throw new Error('Please wait for the current update.');
    set({ isSaving: true, error: null });
    try {
      const donation = await acceptNgoDonation(id);
      revision += 1;
      set((state) => ({
        available: state.available.filter((item) => item.id !== id),
        mine: [donation, ...state.mine.filter((item) => item.id !== id)],
      }));
      return donation;
    } catch (error) {
      set({ error: errorMessage(error) });
      await handleUnauthorized(error);
      throw error;
    } finally {
      set({ isSaving: false });
    }
  },
  assign: async (id, volunteerId) => {
    if (get().isSaving) throw new Error('Please wait for the current update.');
    set({ isSaving: true, error: null });
    try {
      const donation = await assignNgoVolunteer(id, volunteerId);
      revision += 1;
      set((state) => ({ mine: upsertDonation(state.mine, donation) }));
      return donation;
    } catch (error) {
      set({ error: errorMessage(error) });
      await handleUnauthorized(error);
      throw error;
    } finally {
      set({ isSaving: false });
    }
  },
}));

export function useNgoDonation(id: string | undefined) {
  return useNgoDonations((state) =>
    state.available.find((item) => item.id === id)
    ?? state.mine.find((item) => item.id === id)
    ?? null);
}
