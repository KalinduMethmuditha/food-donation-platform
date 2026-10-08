import { isAxiosError } from 'axios';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import HouseholdBottomNav from '@/components/household/HouseholdBottomNav';
import { useHouseholdData } from '@/components/household/HouseholdDataProvider';
import AppHeader from '@/components/shared/AppHeader';
import Screen from '@/components/shared/Screen';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import StatusBadge from '@/components/ui/StatusBadge';
import { Colors } from '@/constants/colors';
import { getApiErrorMessage } from '@/services/apiErrors';
import { getCurrentUser, logoutUser, type AuthUser } from '@/services/auth';
import { removeToken } from '@/services/tokenStorage';

export default function HouseholdProfileScreen() {
  const { donations } = useHouseholdData();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const latestLocation = donations[0]?.pickupLocation ?? 'No pickup location saved yet';

  const loadUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setUser(await getCurrentUser());
    } catch (cause) {
      if (isAxiosError(cause) && cause.response?.status === 401) {
        await removeToken();
        router.replace('/login');
        return;
      }
      setError(getApiErrorMessage(cause, 'load'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { void loadUser(); }, [loadUser]));

  const signOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await logoutUser();
    } catch {
      // logoutUser clears the local token even if the server is unavailable.
    } finally {
      router.replace('/welcome');
    }
  };

  return <Screen footer={<HouseholdBottomNav activeTab="profile" />}>
    <AppHeader title="Profile" />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Card style={styles.profile}>
        <View style={styles.avatar}><Icon name="leaf" size={38} /></View>
        {isLoading && !user ? <ActivityIndicator color={Colors.primary} /> : null}
        {user ? <>
          <Text style={styles.title}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <StatusBadge label="Household Donor" />
        </> : null}
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        {error ? <SecondaryButton title="Retry" onPress={() => void loadUser()} /> : null}
        <Text style={styles.subtitle}>Good food. Shared with care.</Text>
      </Card>
      <Card>
        <Text style={styles.label}>Pickup location</Text>
        <View style={styles.locationRow}>
          <Icon name="pin" size={20} />
          <Text style={styles.location}>{latestLocation}</Text>
        </View>
      </Card>
      <PrimaryButton title="Sign Out" loading={isSigningOut} onPress={() => void signOut()} />
    </ScrollView>
  </Screen>;
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16, paddingBottom: 30 },
  profile: { alignItems: 'center', paddingVertical: 32, gap: 14 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
  email: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
  error: { fontSize: 13, color: Colors.danger, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  location: { flex: 1, fontSize: 14, lineHeight: 21, color: Colors.textSecondary },
});
