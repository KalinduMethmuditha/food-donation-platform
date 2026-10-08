import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// Same background colour used on every NGO screen (no colour changes)
const BG = '#F2F6F4';

// Make sure the Home screen is always at the bottom of the stack
export const unstable_settings = {
  initialRouteName: 'dashboard',
};

export default function NgoLayout() {
  return (
    <>
      <StatusBar style="dark" />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: BG }, // no white flash between screens
          animation: 'slide_from_right',         // default for detail-type screens
          gestureEnabled: true,                  // swipe back on iOS
        }}
      >
        {/* Main screens (bottom navigation) - quick fade, feels like tabs */}
        <Stack.Screen name="dashboard" options={{ animation: 'fade' }} />
        <Stack.Screen name="donations" options={{ animation: 'fade' }} />
        <Stack.Screen name="activecollection" options={{ animation: 'fade' }} />
        <Stack.Screen name="notifications" options={{ animation: 'fade' }} />

        {/* Flow screens - slide in from the right */}
        <Stack.Screen name="donationdetails" />
        <Stack.Screen name="donationrequest" />
        <Stack.Screen name="assignvolunteer" />
      </Stack>
    </>
  );
}