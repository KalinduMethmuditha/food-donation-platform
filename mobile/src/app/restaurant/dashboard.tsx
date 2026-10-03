import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors } from '@/constants/colors';

export default function RestaurantDashboard() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.menu}>☰</Text>

          <Text style={styles.headerTitle}>
            Restaurant Dashboard
          </Text>

          <Text style={styles.notification}>◉</Text>
        </View>

        {/* Welcome */}
        <Text style={styles.welcome}>
          Welcome back!
        </Text>

        <Text style={styles.subtitle}>
          Manage your surplus food donations
        </Text>

        {/* Create Donation */}
        <View style={styles.actionCard}>
          <Text style={styles.actionTitle}>
            Surplus food available?
          </Text>

          <Text style={styles.actionDescription}>
            Publish a donation in just a few steps
          </Text>

          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>
              Create Donation
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard value="2" label="Active" />
          <StatCard value="14" label="Completed" />
          <StatCard value="16" label="Total" />
        </View>

        {/* Latest Donation */}
        <Text style={styles.sectionTitle}>
          Latest Donation
        </Text>

        <View style={styles.donationCard}>
          <View style={styles.foodPlaceholder} />

          <View style={styles.donationInfo}>
            <Text style={styles.donationTitle}>
              Rice & Curry
            </Text>

            <Text style={styles.donationMeta}>
              10 portions
            </Text>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                Volunteer Assigned
              </Text>
            </View>

            <Text style={styles.pickupText}>
              Pickup before 3:00 PM
            </Text>
          </View>
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>
          Recent Activity
        </Text>

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
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <BottomItem label="Home" active />
        <BottomItem label="Donations" />
        <BottomItem label="Notifications" />
        <BottomItem label="Profile" />
      </View>
    </SafeAreaView>
  );
}

function StatCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ActivityItem({
  icon,
  title,
  description,
  time,
}: {
  icon: string;
  title: string;
  description: string;
  time: string;
}) {
  return (
    <View style={styles.activityCard}>
      <View style={styles.activityIcon}>
        <Text style={styles.activityIconText}>{icon}</Text>
      </View>

      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activityDescription}>
          {description}
        </Text>
      </View>

      <Text style={styles.activityTime}>{time}</Text>
    </View>
  );
}

function BottomItem({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.bottomItem}>
      <View
        style={[
          styles.navIcon,
          active && styles.navIconActive,
        ]}
      />

      <Text
        style={[
          styles.bottomLabel,
          active && styles.bottomLabelActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
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
    paddingBottom: 100,
  },

  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },

  menu: {
    color: Colors.white,
    fontSize: 20,
  },

  headerTitle: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginLeft: 14,
  },

  notification: {
    color: Colors.white,
    fontSize: 18,
  },

  welcome: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginHorizontal: 16,
    marginTop: 20,
  },

  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginHorizontal: 16,
    marginTop: 4,
  },

  actionCard: {
    margin: 16,
    backgroundColor: Colors.primaryLight,
    borderRadius: 16,
    padding: 16,
  },

  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  actionDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },

  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 14,
  },

  primaryButtonText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },

  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 10,
  },

  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 14,
    alignItems: 'center',
  },

  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },

  statLabel: {
    marginTop: 3,
    fontSize: 11,
    color: Colors.textSecondary,
  },

  sectionTitle: {
    marginHorizontal: 16,
    marginTop: 22,
    marginBottom: 10,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  donationCard: {
    marginHorizontal: 16,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
  },

  foodPlaceholder: {
    width: 76,
    height: 76,
    backgroundColor: '#E7E9E8',
    borderRadius: 12,
  },

  donationInfo: {
    flex: 1,
    marginLeft: 12,
  },

  donationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  donationMeta: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 7,
  },

  badgeText: {
    fontSize: 10,
    color: Colors.primaryDark,
    fontWeight: '600',
  },

  pickupText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 7,
  },

  activityCard: {
    marginHorizontal: 16,
    marginBottom: 9,
    backgroundColor: Colors.surface,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  activityIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  activityIconText: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },

  activityContent: {
    marginLeft: 10,
    flex: 1,
  },

  activityTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },

  activityDescription: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  activityTime: {
    fontSize: 10,
    color: Colors.textMuted,
  },

  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },

  bottomItem: {
    flex: 1,
    alignItems: 'center',
  },

  navIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: Colors.textMuted,
  },

  navIconActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  bottomLabel: {
    fontSize: 10,
    marginTop: 4,
    color: Colors.textMuted,
  },

  bottomLabelActive: {
    color: Colors.primaryDark,
    fontWeight: '600',
  },
});