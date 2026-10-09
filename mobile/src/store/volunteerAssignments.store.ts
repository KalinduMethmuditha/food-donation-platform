import { isAxiosError } from 'axios';
import { router } from 'expo-router';
import { create } from 'zustand';

import { getApiErrorMessage } from '@/services/apiErrors';
import {
  addVolunteerAssignmentUpdate,
  getVolunteerAssignments,
  markVolunteerNotificationsRead,
  updateVolunteerAssignmentStatus,
  updateVolunteerAvailability,
  type VolunteerAssignment,
} from '@/services/volunteerAssignments';
import { removeToken } from '@/services/tokenStorage';

type NextStatus = 'pickup' | 'arrived' | 'collected' | 'delivered';
type State = {
  assignments: VolunteerAssignment[];
  selectedId: string | null;
  isAvailable: boolean;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  readNotificationIds: number[];
  selectAssignment: (id: string) => void;
  refresh: () => Promise<void>;
  advance: (id: string, status: NextStatus) => Promise<VolunteerAssignment>;
  addUpdate: (id: string, note: string) => Promise<VolunteerAssignment>;
  setAvailability: (value: boolean) => Promise<void>;
  markRead: (ids: number[]) => Promise<void>;
  clear: () => void;
};

async function handleAuthError(error: unknown) {
  if (isAxiosError(error) && error.response?.status === 401) {
    await removeToken();
    router.replace('/login');
  }
}

function message(error: unknown) {
  if (isAxiosError<{ message?: string }>(error) && error.response?.data?.message) {
    return error.response.data.message;
  }
  return getApiErrorMessage(error, 'load');
}

function replaceAssignment(items: VolunteerAssignment[], updated: VolunteerAssignment) {
  return items.map((item) => item.id === updated.id ? updated : item);
}

let refreshId = 0;
let mutationVersion = 0;

export const useVolunteerAssignments = create<State>((set, get) => ({
  assignments: [],
  selectedId: null,
  isAvailable: false,
  isLoading: false,
  isSaving: false,
  error: null,
  readNotificationIds: [],
  clear: () => {
    refreshId += 1;
    mutationVersion += 1;
    set({ assignments: [], selectedId: null, isAvailable: false, isLoading: false, isSaving: false, error: null, readNotificationIds: [] });
  },
  selectAssignment: (id) => set({ selectedId: id }),
  refresh: async () => {
    const requestId = ++refreshId;
    const version = mutationVersion;
    set({ isLoading: true, error: null });
    try {
      const result = await getVolunteerAssignments();
      if (requestId === refreshId && version === mutationVersion) set((state) => ({
        assignments: result.assignments,
        isAvailable: result.isAvailable,
        readNotificationIds: result.readNotificationIds,
        selectedId: result.assignments.some((item) => item.id === state.selectedId)
          ? state.selectedId : result.assignments[0]?.id ?? null,
      }));
    } catch (error) {
      if (requestId === refreshId) set({ error: message(error) });
      await handleAuthError(error);
    } finally {
      if (requestId === refreshId) set({ isLoading: false });
    }
  },
  advance: async (id, status) => {
    if (get().isSaving) throw new Error('Please wait for the current update.');
    set({ isSaving: true, error: null });
    try {
      const updated = await updateVolunteerAssignmentStatus(id, status);
      mutationVersion += 1;
      set((state) => ({ assignments: replaceAssignment(state.assignments, updated) }));
      return updated;
    } catch (error) {
      set({ error: message(error) });
      await handleAuthError(error);
      throw error;
    } finally {
      set({ isSaving: false });
    }
  },
  addUpdate: async (id, note) => {
    if (get().isSaving) throw new Error('Please wait for the current update.');
    set({ isSaving: true, error: null });
    try {
      const updated = await addVolunteerAssignmentUpdate(id, note);
      mutationVersion += 1;
      set((state) => ({ assignments: replaceAssignment(state.assignments, updated) }));
      return updated;
    } catch (error) {
      set({ error: message(error) });
      await handleAuthError(error);
      throw error;
    } finally {
      set({ isSaving: false });
    }
  },
  setAvailability: async (value) => {
    set({ isSaving: true, error: null });
    try {
      const isAvailable = await updateVolunteerAvailability(value);
      mutationVersion += 1;
      set({ isAvailable });
    } catch (error) {
      set({ error: message(error) });
      await handleAuthError(error);
      throw error;
    } finally {
      set({ isSaving: false });
    }
  },
  markRead: async (ids) => {
    try {
      const readNotificationIds = await markVolunteerNotificationsRead(ids);
      mutationVersion += 1;
      set({ readNotificationIds });
    } catch (error) {
      set({ error: message(error) });
      await handleAuthError(error);
      throw error;
    }
  },
}));

export function useSelectedAssignment() {
  return useVolunteerAssignments((state) =>
    state.assignments.find((item) => item.id === state.selectedId) ?? null);
}
