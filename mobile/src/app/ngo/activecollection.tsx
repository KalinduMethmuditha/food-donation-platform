import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { NgoAction, NgoBottomNav, NgoCard, NgoColors, NgoDonationCard, NgoHeader } from '@/components/ngo/NgoUI';
import { useNgoDonation, useNgoDonations } from '@/store/ngoDonations.store';
import { getDonationTimeline } from '@/utils/donation';

export default function ActiveCollection() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const mine = useNgoDonations((state) => state.mine);
  const donation = useNgoDonation(id);
  const refresh = useNgoDonations((state) => state.refresh);
  const loadDonation = useNgoDonations((state) => state.loadDonation);
  const error = useNgoDonations((state) => state.error);
  const isLoading = useNgoDonations((state) => state.isLoading);
  const [isRefreshingDetail, setIsRefreshingDetail] = useState(false);

  const refreshStatus = useCallback(async () => {
    await refresh();
    if (id) {
      setIsRefreshingDetail(true);
      try {
        await loadDonation(id);
      } catch {
        // The store exposes the API error below.
      } finally {
        setIsRefreshingDetail(false);
      }
    }
  }, [id, refresh, loadDonation]);

  useFocusEffect(useCallback(() => { void refreshStatus(); }, [refreshStatus]));

  const active = mine.filter((item) => !['delivered', 'cancelled'].includes(item.status));
  const completed = mine.filter((item) => item.status === 'delivered');

  return (
    <View style={styles.root}>
      <NgoHeader title={id ? 'Collection Status' : 'My Collections'} back={Boolean(id)} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading || isRefreshingDetail ? <ActivityIndicator color={NgoColors.primary} /> : null}
        {error ? <NgoCard><Text accessibilityRole="alert" style={styles.error}>{error}</Text></NgoCard> : null}
        {id ? donation ? (
          <>
            <NgoDonationCard donation={donation} onPress={() => router.push({ pathname: '/ngo/donationdetails' as any, params: { id } })} />
            <NgoCard>
              <Text style={styles.title}>Pickup progress</Text>
              <Text style={styles.body}>Volunteer: {donation.volunteerName ?? 'Awaiting assignment'}</Text>
              {getDonationTimeline(donation.status, donation.statusLogs).map((step) => (
                <View key={step.title} style={styles.step}>
                  <View style={[styles.dot, step.status !== 'pending' && styles.dotActive]} />
                  <View style={styles.stepBody}>
                    <Text style={[styles.stepTitle, step.status === 'pending' && styles.pending]}>{step.title}</Text>
                    <Text style={styles.body}>{step.time ?? (step.status === 'pending' ? 'Pending' : step.status === 'current' ? 'Current step' : 'Completed')}</Text>
                  </View>
                </View>
              ))}
            </NgoCard>
            {donation.status === 'accepted' ? (
              <NgoAction label="Assign Volunteer" onPress={() => router.push({ pathname: '/ngo/assignvolunteer' as any, params: { id } })} />
            ) : null}
            <NgoAction label="Refresh Status" onPress={() => { void refreshStatus(); }} disabled={isLoading || isRefreshingDetail} />
          </>
        ) : !isLoading && !isRefreshingDetail ? <NgoCard><Text style={styles.body}>Collection not found.</Text></NgoCard> : null : (
          <>
            <Text style={styles.title}>Active collections ({active.length})</Text>
            <View style={styles.list}>
              {active.map((item) => <NgoDonationCard key={item.id} donation={item} onPress={() => router.push({ pathname: '/ngo/activecollection' as any, params: { id: item.id } })} />)}
              {!isLoading && !error && active.length === 0 ? <NgoCard><Text style={styles.body}>No active collections yet. Accept a donation to get started.</Text></NgoCard> : null}
            </View>
            {completed.length > 0 ? <Text style={styles.title}>Delivered ({completed.length})</Text> : null}
            <View style={styles.list}>
              {completed.map((item) => <NgoDonationCard key={item.id} donation={item} onPress={() => router.push({ pathname: '/ngo/activecollection' as any, params: { id: item.id } })} />)}
            </View>
          </>
        )}
      </ScrollView>
      {!id ? <NgoBottomNav active="collections" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: NgoColors.bg },
  content: { padding: 16, paddingBottom: 40, gap: 14 },
  title: { color: NgoColors.text, fontSize: 17, fontWeight: '800' },
  body: { color: NgoColors.muted, fontSize: 12, lineHeight: 18, marginTop: 3 },
  list: { gap: 10 },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: NgoColors.border },
  dot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: NgoColors.border, marginTop: 3 },
  dotActive: { backgroundColor: NgoColors.primaryDark, borderColor: NgoColors.primaryDark },
  stepBody: { flex: 1 },
  stepTitle: { color: NgoColors.text, fontWeight: '700' },
  pending: { color: NgoColors.muted },
  error: { color: NgoColors.danger },
});
