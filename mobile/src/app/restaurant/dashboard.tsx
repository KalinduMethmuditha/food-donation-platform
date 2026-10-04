import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AppHeader from '@/components/restaurant/AppHeader';
import BottomNavigation from '@/components/restaurant/BottomNavigation';
import { useRestaurantData } from '@/components/restaurant/RestaurantDataProvider';
import StatCard from '@/components/shared/StatCard';
import ActivityItem from '@/components/shared/ActivityItem';
import DonationCard from '@/components/shared/DonationCard';
import Screen from '@/components/shared/Screen';
import Icon from '@/components/ui/Icon';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Colors } from '@/constants/colors';
import { mockActivities, mockDonations, mockRestaurantStats } from '@/data/mockRestaurantData';

export default function RestaurantDashboard() {
  const { donations } = useRestaurantData();
  const latestDonation = donations[0];
  const publishedCount = donations.length - mockDonations.length;

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
        <StatCard value={mockRestaurantStats.active + publishedCount} label="Active" />
        <StatCard value={mockRestaurantStats.completed} label="Completed" />
        <StatCard value={mockRestaurantStats.total + publishedCount} label="Total" />
      </View>

      <Text style={styles.sectionTitle}>Latest Donation</Text>
      {latestDonation && <DonationCard donation={latestDonation}
        onPress={() => router.push({ pathname: '/restaurant/donations/[id]', params: { id: latestDonation.id } })} />}

      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <View style={styles.activityList}>
        {mockActivities.map((activity) => <ActivityItem key={activity.id} {...activity} />)}
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
});
