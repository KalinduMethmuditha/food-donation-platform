import { createContext, useContext } from 'react';

import type { AuthUser } from '@/services/auth';

export const NgoSessionContext = createContext<AuthUser | null>(null);

export function useNgoSession() {
  return useContext(NgoSessionContext);
}
