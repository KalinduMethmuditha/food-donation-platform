import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useRestaurantData } from '@/components/restaurant/RestaurantDataProvider';
import AppHeader from '@/components/shared/AppHeader';
import DonationTimeline from '@/components/shared/DonationTimeline';
import EmptyState from '@/components/shared/EmptyState';
import Screen from '@/components/shared/Screen';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import StatusBadge from '@/components/ui/StatusBadge';
import { Colors } from '@/constants/colors';
import { getApiErrorMessage } from '@/services/apiErrors';
import { getDonationStatusLabel, getDonationTimeLabel, getDonationTimeline } from '@/utils/donation';

export default function DonationDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { donations, isLoading, getDonationById } = useRestaurantData();
  const donation = donations.find((item) => item.id === id);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchDonation = useCallback(async (donationId: string) => {
    setIsFetching(true);
    setFetchError(null);
    try {
      await getDonationById(donationId);
    } catch (error) {
      setFetchError(getApiErrorMessage(error, 'load'));
    } finally {
      setIsFetching(false);
    }
  }, [getDonationById]);

  useFocusEffect(useCallback(() => {
    if (id) void fetchDonation(id);
  }, [id, fetchDonation]));

  const openDonations = () => router.navigate('/restaurant/donations');
  const goBack = () => router.canGoBack() ? router.back() : router.replace('/restaurant/donations');

  return (
    <Screen footer={<PrimaryButton title="My Donations" onPress={openDonations} />}>
      <AppHeader title="Donation Details" showBack onBackPress={goBack} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!donation ? (
          isLoading || isFetching ? <ActivityIndicator color={Colors.primary} /> :
            fetchError ? <View>
              <EmptyState title="Could not load donation" description={fetchError} />
              <SecondaryButton title="Retry" onPress={() => id && void fetchDonation(id)} />
            </View> : null
        ) : (
          <>
            <Card>
              <View style={styles.summaryRow}>
                <View style={styles.foodIcon}><Icon name="leaf" size={30} /></View>
                <View style={styles.summaryContent}>
                  <Text accessibilityRole="header" style={styles.foodName}>{donation.foodType}</Text>
                  <Text style={styles.meta}>{donation.quantity} {donation.unit}</Text>
                  <StatusBadge label={getDonationStatusLabel(donation.status)} />
                </View>
              </View>
              <View style={styles.deadlineRow}>
                <Icon name="clock" size={16} />
                <Text style={styles.deadline}>{getDonationTimeLabel(donation)}</Text>
              </View>
              <Text selectable style={styles.id}>Donation ID: #{donation.id}</Text>
            </Card>

            <Text accessibilityRole="header" style={styles.sectionTitle}>Progress Status</Text>
            <Card><DonationTimeline items={getDonationTimeline(donation.status, donation.statusLogs)} /></Card>

            <Text accessibilityRole="header" style={styles.sectionTitle}>Collection Details</Text>
            <Card>
              <View style={styles.organizationRow}>
                <View style={styles.avatar}><Icon name="users" size={24} /></View>
                <View style={styles.organizationInfo}>
                  <Text style={styles.organizationName}>{donation.ngoName || 'Awaiting NGO acceptance'}</Text>
                  <Text style={styles.bodyText}>
                    {donation.volunteerName ? `Volunteer: ${donation.volunteerName}` : 'Volunteer not assigned yet'}
                  </Text>
                </View>
              </View>
              <View style={styles.locationRow}>
                <Icon name="pin" size={18} color={Colors.textSecondary} />
                <Text style={styles.location}>{donation.pickupLocation}</Text>
              </View>
              {donation.description ? (
                <View style={styles.notes}>
                  <Text style={styles.notesLabel}>Notes</Text>
                  <Text style={styles.bodyText}>{donation.description}</Text>
                </View>
              ) : null}
            </Card>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 24 },
  summaryRow: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  foodIcon: {
    width: 66,
    height: 66,
    borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryContent: { flex: 1, gap: 6 },
  foodName: { fontSize: 19, lineHeight: 25, fontWeight: '700', color: Colors.textPrimary },
  meta: { fontSize: 14, color: Colors.textSecondary },
  deadlineRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 16 },
  deadline: { flex: 1, fontSize: 13, lineHeight: 19, color: Colors.primaryDark, fontWeight: '600' },
  id: { marginTop: 8, fontSize: 12, lineHeight: 17, color: Colors.textSecondary },
  sectionTitle: { marginTop: 24, marginBottom: 10, fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  organizationRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  organizationInfo: { flex: 1 },
  organizationName: { fontSize: 14, lineHeight: 20, fontWeight: '600', color: Colors.textPrimary },
  bodyText: { marginTop: 4, fontSize: 13, lineHeight: 20, color: Colors.textSecondary },
  locationRow: { flexDirection: 'row', gap: 8, marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: Colors.border },
  location: { flex: 1, fontSize: 13, lineHeight: 20, color: Colors.textSecondary },
  notes: { marginTop: 14 },
  notesLabel: { fontSize: 12, fontWeight: '600', color: Colors.textPrimary },
});
