import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useNgoSession } from '@/components/ngo/NgoSessionContext';
import { NgoAction, NgoBottomNav, NgoCard, NgoColors, NgoDonationCard, NgoHeader } from '@/components/ngo/NgoUI';
import { logoutUser } from '@/services/auth';
import { useNgoDonations } from '@/store/ngoDonations.store';
import { getDonationStatusLabel } from '@/utils/donation';

export default function NgoDashboard() {
  const user = useNgoSession();
  const available = useNgoDonations((state) => state.available);
  const mine = useNgoDonations((state) => state.mine);
  const isLoading = useNgoDonations((state) => state.isLoading);
  const error = useNgoDonations((state) => state.error);
  const refresh = useNgoDonations((state) => state.refresh);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));

  const signOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await logoutUser();
    } catch {
      // Local authentication is cleared even if the server is unavailable.
    } finally {
      router.replace('/welcome');
    }
  };

  const inCollection = mine.filter((item) => !['delivered', 'cancelled'].includes(item.status)).length;
  const delivered = mine.filter((item) => item.status === 'delivered').length;

  return (
    <View style={styles.root}>
      <NgoHeader title="NGO Dashboard" action={{ icon: 'arrow.right.square', label: 'Sign out', onPress: () => { void signOut(); } }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.welcome}>Welcome back, {user?.name ?? 'NGO'}!</Text>
        <Text style={styles.subtitle}>Coordinate donations from restaurants and households.</Text>

        <NgoCard>
          <Text style={styles.calloutTitle}>{available.length} available {available.length === 1 ? 'donation' : 'donations'}</Text>
          <Text style={styles.body}>Review published food donations and assign a volunteer after accepting one.</Text>
          <View style={styles.actionSpacing}>
            <NgoAction label="View Available Donations" onPress={() => router.push('/ngo/donations' as any)} />
          </View>
        </NgoCard>

        <View style={styles.stats}>
          <View style={styles.stat}><Text style={styles.statValue}>{available.length}</Text><Text style={styles.statLabel}>Available</Text></View>
          <View style={styles.stat}><Text style={styles.statValue}>{inCollection}</Text><Text style={styles.statLabel}>Active</Text></View>
          <View style={styles.stat}><Text style={styles.statValue}>{delivered}</Text><Text style={styles.statLabel}>Delivered</Text></View>
        </View>

        {isLoading && available.length === 0 && mine.length === 0 ? <ActivityIndicator color={NgoColors.primary} /> : null}
        {error ? <NgoCard><Text accessibilityRole="alert" style={styles.error}>{error}</Text><NgoAction label="Try Again" onPress={() => { void refresh(); }} /></NgoCard> : null}

        <Text style={styles.sectionTitle}>My recent donations</Text>
        <View style={styles.list}>
          {mine.slice(0, 3).map((donation) => (
            <NgoDonationCard key={donation.id} donation={donation} onPress={() => router.push({ pathname: '/ngo/activecollection' as any, params: { id: donation.id } })} />
          ))}
          {!isLoading && !error && mine.length === 0 ? <NgoCard><Text style={styles.body}>Accepted donations will appear here.</Text></NgoCard> : null}
        </View>

        {mine.length > 0 ? <Text style={styles.statusHint}>Latest: {getDonationStatusLabel(mine[0].status)}</Text> : null}
      </ScrollView>
      <NgoBottomNav active="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: NgoColors.bg },
  content: { padding: 16, paddingBottom: 32, gap: 14 },
  welcome: { color: NgoColors.text, fontSize: 25, fontWeight: '800', marginTop: 4 },
  subtitle: { color: NgoColors.muted, fontSize: 13, marginBottom: 4 },
  calloutTitle: { color: NgoColors.text, fontSize: 18, fontWeight: '800' },
  body: { color: NgoColors.muted, fontSize: 13, lineHeight: 20, marginTop: 5 },
  actionSpacing: { marginTop: 14 },
  stats: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, backgroundColor: NgoColors.card, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: NgoColors.border },
  statValue: { color: NgoColors.primaryDark, fontSize: 25, fontWeight: '800' },
  statLabel: { color: NgoColors.muted, fontSize: 11, marginTop: 3 },
  sectionTitle: { color: NgoColors.text, fontSize: 17, fontWeight: '800', marginTop: 8 },
  list: { gap: 10 },
  error: { color: NgoColors.danger, marginBottom: 12 },
  statusHint: { color: NgoColors.muted, fontSize: 12 },
});
