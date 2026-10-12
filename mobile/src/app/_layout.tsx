import { Stack, usePathname } from 'expo-router';
import AccountNotificationPopup from '@/components/shared/AccountNotificationPopup';
import type { UserRole } from '@/services/auth';

export default function RootLayout() {
  const segment = usePathname().split('/')[1];
  const role = ['ngo', 'volunteer', 'restaurant', 'household'].includes(segment) ? segment as UserRole : null;
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      {role ? <AccountNotificationPopup key={role} role={role} /> : null}
    </>
  );
}
