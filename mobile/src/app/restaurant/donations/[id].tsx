import { router, useLocalSearchParams } from 'expo-router';

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AppHeader from '@/components/restaurant/AppHeader';
import DonationTimeline from '@/components/shared/DonationTimeline';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Colors } from '@/constants/colors';

export default function DonationDetailsScreen() {
  const { id } = useLocalSearchParams();

  const timeline = [
    {
      title: 'Donation Published',
      time: '12:05 PM',
      status: 'completed' as const,
    },
    {
      title: 'NGO Accepted',
      time: '12:18 PM',
      status: 'completed' as const,
    },
    {
      title: 'Volunteer Assigned',
      time: '12:32 PM',
      status: 'current' as const,
    },
    {
      title: 'Pickup in Progress',
      status: 'pending' as const,
    },
    {
      title: 'Food Collected',
      status: 'pending' as const,
    },
  ];

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Donation Details"
        showBack
        onBackPress={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <View style={styles.foodPlaceholder} />

          <View style={styles.summaryContent}>
            <Text style={styles.foodName}>
              Rice & Curry
            </Text>

            <Text style={styles.meta}>
              10 portions
            </Text>

            <Text style={styles.deadline}>
              Pickup before 3:00 PM
            </Text>

            <Text style={styles.id}>
              Donation ID: #{id}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Progress Status
        </Text>

        <View style={styles.timelineCard}>
          <DonationTimeline items={timeline} />
        </View>

        <Text style={styles.sectionTitle}>
          Collection Details
        </Text>

        <View style={styles.organizationCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>H</Text>
          </View>

          <View style={styles.organizationInfo}>
            <Text style={styles.organizationName}>
              Hope Community NGO
            </Text>

            <Text style={styles.volunteer}>
              Volunteer: S. Perera
            </Text>
          </View>
        </View>

        <PrimaryButton
          title="My Donations"
          style={styles.button}
          onPress={() =>
            router.push('/restaurant/donations')
          }
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    padding: 16,
    paddingBottom: 30,
  },

  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    flexDirection: 'row',
  },

  foodPlaceholder: {
    width: 76,
    height: 76,
    borderRadius: 12,
    backgroundColor: '#E7E9E8',
  },

  summaryContent: {
    flex: 1,
    marginLeft: 12,
  },

  foodName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  meta: {
    marginTop: 2,
    fontSize: 12,
    color: Colors.textSecondary,
  },

  deadline: {
    marginTop: 7,
    fontSize: 12,
    color: Colors.primaryDark,
    fontWeight: '600',
  },

  id: {
    marginTop: 5,
    fontSize: 10,
    color: Colors.textMuted,
  },

  sectionTitle: {
    marginTop: 22,
    marginBottom: 10,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  timelineCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },

  organizationCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primaryDark,
  },

  organizationInfo: {
    marginLeft: 12,
  },

  organizationName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  volunteer: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.textSecondary,
  },

  button: {
    marginTop: 22,
  },
});