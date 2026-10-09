import { create } from 'zustand';
import type { AuthUser } from '@/services/auth';

export const useAccountStore = create<{ user: AuthUser | null; setUser: (user: AuthUser | null) => void }>((set) => ({
  user: null, setUser: (user) => set({ user }),
}));
