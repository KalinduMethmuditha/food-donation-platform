import { router } from 'expo-router';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ActivityItem from '@/components/restaurant/ActivityItem';
import AppHeader from '@/components/restaurant/AppHeader';
import BottomNavigation from '@/components/restaurant/BottomNavigation';
import DonationCard from '@/components/restaurant/DonationCard';
import StatCard from '@/components/restaurant/StatCard';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Colors } from '@/constants/colors';

export default function RestaurantDashboard() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader title="Restaurant Dashboard" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.welcome}>Welcome back!</Text>

        <Text style={styles.subtitle}>
          Manage your surplus food donations
        </Text>

        <View style={styles.actionCard}>
          <Text style={styles.actionTitle}>
            Surplus food available?
          </Text>

          <Text style={styles.actionDescription}>
            Publish a donation in just a few steps
          </Text>

          <PrimaryButton
            title="Create Donation"
            style={styles.createButton}
            onPress={() =>
              router.push('/restaurant/create-donation/food-details')
            }
          />
        </View>

        <View style={styles.statsRow}>
          <StatCard value={2} label="Active" />
          <StatCard value={14} label="Completed" />
          <StatCard value={16} label="Total" />
        </View>

        <Text style={styles.sectionTitle}>
          Latest Donation
        </Text>

        <View style={styles.horizontalPadding}>
          <DonationCard
            foodName="Rice & Curry"
            quantity="10 portions"
            status="Volunteer Assigned"
            pickupTime="Pickup before 3:00 PM"
          />
        </View>

        <Text style={styles.sectionTitle}>
          Recent Activity
        </Text>

        <View style={styles.activityList}>
          <ActivityItem
            icon="✓"
            title="Donation accepted"
            description="Hope Community NGO"
            time="5 min ago"
          />

          <ActivityItem
            icon="●"
            title="Volunteer assigned"
            description="S. Perera"
            time="12 min ago"
          />
        </View>
      </ScrollView>

      <BottomNavigation activeTab="Home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  container: {
    flex: 1,
  },

  content: {
    paddingBottom: 24,
  },

  welcome: {
    marginHorizontal: 16,
    marginTop: 20,
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
  },

  subtitle: {
    marginHorizontal: 16,
    marginTop: 4,
    fontSize: 13,
    color: Colors.textSecondary,
  },

  actionCard: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
  },

  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  actionDescription: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.textSecondary,
  },

  createButton: {
    marginTop: 14,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 16,
  },

  sectionTitle: {
    marginHorizontal: 16,
    marginTop: 22,
    marginBottom: 10,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  horizontalPadding: {
    paddingHorizontal: 16,
  },

  activityList: {
    paddingHorizontal: 16,
    gap: 9,
  },
});