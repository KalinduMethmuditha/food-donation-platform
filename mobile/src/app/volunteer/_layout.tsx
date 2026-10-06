import { Stack } from 'expo-router';

export default function VolunteerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="pickup-details" />
      <Stack.Screen name="route" />
      <Stack.Screen name="collection-status" />
      <Stack.Screen name="confirmation" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="activity" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
