import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { NgoSessionContext } from '@/components/ngo/NgoSessionContext';
import WebRoleFrame from '@/components/shared/WebRoleFrame';
import { Colors } from '@/constants/colors';
import { demoRoleDestinations } from '@/constants/demoRoles';
import { getCurrentUser, type AuthUser } from '@/services/auth';

// Same background colour used on every NGO screen (no colour changes)
const BG = '#F2F6F4';

// Make sure the Home screen is always at the bottom of the stack
export const unstable_settings = {
  initialRouteName: 'dashboard',
};

export default function NgoLayout() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let active = true;

    void getCurrentUser()
      .then((currentUser) => {
        if (!active) return;

        if (currentUser.role !== 'ngo') {
          router.replace(demoRoleDestinations[currentUser.role]);
          return;
        }

        setUser(currentUser);
      })
      .catch(() => {
        if (active) router.replace('/login');
      });

    return () => {
      active = false;
    };
  }, []);

  if (!user) {
    return (
      <WebRoleFrame backgroundColor={BG}>
        <View style={styles.loading}>
          <ActivityIndicator color={Colors.primary} accessibilityLabel="Loading NGO account" />
        </View>
      </WebRoleFrame>
    );
  }

  return (
    <NgoSessionContext.Provider value={user}>
      <StatusBar style="dark" />

      <WebRoleFrame backgroundColor={BG}>
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
          <Stack.Screen name="profile" options={{ animation: 'fade' }} />
          <Stack.Screen name="edit-profile" />

          {/* Flow screens - slide in from the right */}
          <Stack.Screen name="donationdetails" />
          <Stack.Screen name="donationrequest" />
          <Stack.Screen name="assignvolunteer" />
        </Stack>
      </WebRoleFrame>
    </NgoSessionContext.Provider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BG,
  },
});
