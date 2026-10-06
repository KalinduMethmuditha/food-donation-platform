import { router } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppHeader from '@/components/restaurant/AppHeader';
import BottomNavigation from '@/components/restaurant/BottomNavigation';
import { useRestaurantData } from '@/components/restaurant/RestaurantDataProvider';
import StatCard from '@/components/shared/StatCard';
import ActivityItem from '@/components/shared/ActivityItem';
import DonationCard from '@/components/shared/DonationCard';
import EmptyState from '@/components/shared/EmptyState';
import Screen from '@/components/shared/Screen';
import Icon from '@/components/ui/Icon';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { Colors } from '@/constants/colors';
import { formatDateTime } from '@/utils/dateTime';
import { getDonationActivity } from '@/utils/donation';

export default function RestaurantDashboard() {
  const { donations, isLoading, loadError, refreshDonations } = useRestaurantData();
  const latestDonation = donations[0];
  const activeCount = donations.filter((donation) => donation.status !== 'collected' && donation.status !== 'cancelled').length;
  const completedCount = donations.filter((donation) => donation.status === 'collected').length;
  const activities = getDonationActivity(donations).slice(0, 4);

  return <Screen>
    <AppHeader title="Restaurant Dashboard" />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.welcomeRow}>
        <View style={styles.welcomeText}>
          <Text style={styles.welcome}>Welcome back!</Text>
          <Text style={styles.subtitle}>Manage your surplus food donations</Text>
        </View>
        <View style={styles.leaf}><Icon name="leaf" size={28} /></View>
      </View>

      <View style={styles.actionCard}>
        <Text style={styles.actionTitle}>Surplus food available?</Text>
        <Text style={styles.actionDescription}>Publish a donation in just a few steps</Text>
        <PrimaryButton title="Create Donation" style={styles.createButton}
          onPress={() => router.push('/restaurant/create-donation/food-details')} />
      </View>

      <View style={styles.statsRow}>
        <StatCard value={activeCount} label="Active" />
        <StatCard value={completedCount} label="Completed" />
        <StatCard value={donations.length} label="Total" />
      </View>

      {isLoading && donations.length === 0 ? <ActivityIndicator color={Colors.primary} /> : null}
      {loadError ? <View style={styles.loadError}>
        <Text accessibilityRole="alert" style={styles.errorText}>{loadError}</Text>
        <SecondaryButton title="Retry" onPress={() => void refreshDonations()} />
      </View> : null}

      <Text style={styles.sectionTitle}>Latest Donation</Text>
      {latestDonation ? <DonationCard donation={latestDonation}
        onPress={() => router.push({ pathname: '/restaurant/donations/[id]', params: { id: latestDonation.id } })} />
        : !isLoading && !loadError ? <EmptyState title="No donations yet" description="Publish your first donation to see it here." /> : null}

      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <View style={styles.activityList}>
        {activities.map((activity) => <ActivityItem key={activity.id} icon={activity.icon}
          title={activity.title} description={activity.foodType} time={formatDateTime(activity.createdAt)} />)}
        {!isLoading && !loadError && activities.length === 0 ?
          <Text style={styles.emptyActivity}>No recent activity yet.</Text> : null}
      </View>
    </ScrollView>
    <BottomNavigation activeTab="Home" />
  </Screen>;
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 28 },
  welcomeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  welcomeText: { flex: 1 },
  welcome: { fontSize: 25, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { marginTop: 6, fontSize: 13, lineHeight: 20, color: Colors.textSecondary },
  leaf: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  actionCard: { marginTop: 22, padding: 18, borderRadius: 16, backgroundColor: Colors.primaryLight },
  actionTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  actionDescription: { marginTop: 5, fontSize: 13, lineHeight: 20, color: Colors.textSecondary },
  createButton: { marginTop: 16 },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  sectionTitle: { marginTop: 24, marginBottom: 12, fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  activityList: { gap: 10 },
  loadError: { marginTop: 16, gap: 8 },
  errorText: { color: Colors.danger, fontSize: 13 },
  emptyActivity: { color: Colors.textSecondary, fontSize: 13 },
});
