import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import HouseholdDataProvider from '@/components/household/HouseholdDataProvider';
import { Colors } from '@/constants/colors';

export default function HouseholdLayout() {
  return <HouseholdDataProvider>
    <StatusBar style="dark" />
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }} />
  </HouseholdDataProvider>;
}
