import { createContext, useContext } from 'react';

import type { AuthUser } from '@/services/auth';
import { useAccountStore } from '@/store/account.store';

export const NgoSessionContext = createContext<AuthUser | null>(null);

export function useNgoSession() {
  const session = useContext(NgoSessionContext);
  const currentUser = useAccountStore((state) => state.user);
  return currentUser?.id === session?.id && currentUser?.role === 'ngo' ? currentUser : session;
}
