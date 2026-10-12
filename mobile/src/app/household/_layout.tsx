import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import HouseholdDataProvider from '@/components/household/HouseholdDataProvider';
import WebRoleFrame from '@/components/shared/WebRoleFrame';
import { Colors } from '@/constants/colors';

export default function HouseholdLayout() {
  return <HouseholdDataProvider>
    <StatusBar style="dark" />
    <WebRoleFrame>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }} />
    </WebRoleFrame>
  </HouseholdDataProvider>;
}
