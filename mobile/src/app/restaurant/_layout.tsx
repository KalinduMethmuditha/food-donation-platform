import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import RestaurantDataProvider from '@/components/restaurant/RestaurantDataProvider';
import { Colors } from '@/constants/colors';

export default function RestaurantLayout() {
  return (
    <RestaurantDataProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
        }}
      />
    </RestaurantDataProvider>
  );
}
