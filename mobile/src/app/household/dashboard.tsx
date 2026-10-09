import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import HouseholdBottomNav from '@/components/household/HouseholdBottomNav';
import { useHouseholdData } from '@/components/household/HouseholdDataProvider';
import ActivityItem from '@/components/shared/ActivityItem';
import AppHeader from '@/components/shared/AppHeader';
import EmptyState from '@/components/shared/EmptyState';
import Screen from '@/components/shared/Screen';
import StatCard from '@/components/shared/StatCard';
import DashboardHero from '@/components/shared/DashboardHero';
import Card from '@/components/ui/Card';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import StatusBadge from '@/components/ui/StatusBadge';
import { Colors } from '@/constants/colors';
import { getDonationActivity, getDonationStatusLabel, getDonationTimeLabel } from '@/utils/donation';
import { formatDateTime } from '@/utils/dateTime';
import { useDonationDraftStore } from '@/stores/donationDraft.store';

export default function HouseholdDashboard() {
  const { donations, isLoading, loadError, refreshDonations } = useHouseholdData();
  const resetDraft = useDonationDraftStore((state) => state.resetDraft);

  useFocusEffect(useCallback(() => { void refreshDonations(); }, [refreshDonations]));

  const active = donations.filter((item) => !['collected', 'delivered', 'cancelled'].includes(item.status)).length;
  const completed = donations.filter((item) => item.status === 'collected' || item.status === 'delivered').length;
  const latest = donations[0];
  const activities = getDonationActivity(donations).slice(0, 3);

  const startDonation = () => {
    resetDraft();
    router.push('/household/create-donation/food-details');
  };

  return <Screen navigation={<HouseholdBottomNav activeTab="home" />}>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <DashboardHero header={<AppHeader title="Household Dashboard" variant="hero"
        onMenuPress={() => router.push('/household/profile')} />}
        subtitle="Share extra food with people who need it" emoji="🧺" />
      <View style={styles.main}>
      <Card style={styles.actionCard}>
        <Text style={styles.actionTitle}>Have food to share?</Text>
        <Text style={styles.body}>Publish a household food donation in a few steps.</Text>
        <PrimaryButton title="Create Donation" onPress={startDonation} style={styles.actionButton} />
      </Card>

      <View style={styles.stats}>
        <StatCard value={active} label="Active" />
        <StatCard value={completed} label="Collected" />
        <StatCard value={donations.length} label="Total" />
      </View>

      {isLoading && donations.length === 0 ? <ActivityIndicator color={Colors.primary} style={styles.loading} /> : null}
      {loadError ? <Card><Text accessibilityRole="alert" style={styles.error}>{loadError}</Text>
        <SecondaryButton title="Try Again" onPress={() => void refreshDonations()} /></Card> : null}

      <Text style={styles.section}>Latest Donation</Text>
      {latest ? <Pressable onPress={() => router.push({ pathname: '/household/donations/[id]', params: { id: latest.id } })}>
        <Card><View style={styles.row}><Text style={styles.itemTitle}>{latest.foodType}</Text>
          <StatusBadge label={getDonationStatusLabel(latest.status)} /></View>
          <Text style={styles.body}>{latest.quantity} {latest.unit}</Text>
          <Text style={styles.body}>{getDonationTimeLabel(latest)}</Text>
          <Text style={styles.link}>View details →</Text></Card>
      </Pressable> : !isLoading ? <EmptyState title="No donations yet" description="Create your first donation to see it here." icon="heart" /> : null}

      {activities.length > 0 ? <>
        <Text style={styles.section}>Recent Activity</Text>
        {activities.map((item) => <ActivityItem key={item.id} icon={item.icon} title={item.title}
          description={item.foodType} time={formatDateTime(item.createdAt)} />)}
      </> : null}

      <SecondaryButton title="View Donation History" onPress={() => router.push('/household/activity')} />
      </View>
    </ScrollView>
  </Screen>;
}

const styles = StyleSheet.create({
  content: { paddingBottom: 28 },
  main: { marginTop: -36, paddingHorizontal: 16, gap: 12 },
  actionCard: { gap: 7 },
  actionTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  actionButton: { marginTop: 8 },
  body: { fontSize: 13, lineHeight: 20, color: Colors.textSecondary, marginTop: 4 },
  stats: { flexDirection: 'row', gap: 8, marginVertical: 6 },
  loading: { margin: 20 },
  error: { color: Colors.danger, marginBottom: 12 },
  section: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary, marginTop: 10 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  itemTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  link: { color: Colors.primaryDark, fontWeight: '700', marginTop: 12 },
});
