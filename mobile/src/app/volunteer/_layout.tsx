import { router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { demoRoleDestinations } from '@/constants/demoRoles';
import { Colors } from '@/constants/colors';
import { getCurrentUser } from '@/services/auth';
import { useVolunteerAssignments } from '@/store/volunteerAssignments.store';
import WebRoleFrame from '@/components/shared/WebRoleFrame';

export default function VolunteerLayout() {
  const refresh = useVolunteerAssignments((state) => state.refresh);
  const [authorized, setAuthorized] = useState(false);
  useEffect(() => {
    let active = true;
    void getCurrentUser().then((user) => {
      if (!active) return;
      if (user.role !== 'volunteer') {
        router.replace(demoRoleDestinations[user.role]);
        return;
      }
      setAuthorized(true);
      void refresh();
    }).catch(() => { if (active) router.replace('/login'); });
    return () => { active = false; };
  }, [refresh]);

  if (!authorized) return <WebRoleFrame><View style={styles.loading}><ActivityIndicator color={Colors.primary} /></View></WebRoleFrame>;
  return (
    <WebRoleFrame>
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
      </Stack>
    </WebRoleFrame>
  );
}

const styles = StyleSheet.create({ loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background } });
