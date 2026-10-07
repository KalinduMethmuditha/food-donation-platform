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
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="notification-preferences" />
      <Stack.Screen name="pickup-preferences" />
      <Stack.Screen name="help-support" />
      <Stack.Screen name="about" />
      <Stack.Screen name="privacy" />
      <Stack.Screen name="terms" />
      <Stack.Screen name="welcome" />
    </Stack>
  );
}
