import { useEffect } from 'react';
import { getCurrentUser } from '@/services/auth';
import { useAccountStore } from '@/store/account.store';

export default function useDashboardGreeting() {
  const user = useAccountStore((state) => state.user);
  const name = user?.name.trim().split(/\s+/)[0];

  useEffect(() => {
    if (!useAccountStore.getState().user) void getCurrentUser().catch(() => undefined);
  }, []);

  return name ? `Hi ${name}!` : 'Welcome back!';
}
