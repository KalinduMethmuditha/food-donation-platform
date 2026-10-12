import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useHouseholdData } from '@/components/household/HouseholdDataProvider';
import EmptyState from '@/components/shared/EmptyState';
import Screen from '@/components/shared/Screen';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { Colors } from '@/constants/colors';
import { getApiErrorMessage } from '@/services/apiErrors';
import { formatDateTime } from '@/utils/dateTime';

export default function HouseholdDelivered() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { donations, getDonationById } = useHouseholdData();
  const donation = donations.find((item) => item.id === id);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(useCallback(() => {
    let active = true;
    if (!id) {
      setIsLoading(false);
      return () => { active = false; };
    }
    setIsLoading(true);
    setError(null);
    void getDonationById(id)
      .catch((loadError) => { if (active) setError(getApiErrorMessage(loadError, 'load')); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [id, getDonationById]));

  const isCollected = donation?.status === 'collected' || donation?.status === 'delivered';
  const collectedAt = donation?.collectedAt
    ?? donation?.statusLogs?.find((log) => log.status === 'collected')?.createdAt;

  return (
    <Screen footer={<View style={styles.footer}>
      <SecondaryButton title="View History" onPress={() => router.replace('/household/activity')} />
      <PrimaryButton title="Back to Home" onPress={() => router.replace('/household/dashboard')} />
    </View>}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading && !donation ? <ActivityIndicator color={Colors.primary} style={styles.loading} /> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {!isLoading && !isCollected ? (
          <EmptyState
            title="Receipt not available"
            description={donation ? 'This donation has not been collected yet.' : 'Donation not found.'}
          />
        ) : null}
        {isCollected && donation ? (
          <>
            <View style={styles.check}><Icon name="check" size={36} color={Colors.white} /></View>
            <Text style={styles.title}>{donation.status === 'delivered' ? 'Donation Delivered!' : 'Donation Collected!'}</Text>
            <Text style={styles.subtitle}>Your donation of {donation.quantity} {donation.unit} of {donation.foodType} was {donation.status === 'delivered' ? 'delivered successfully' : 'collected'}.</Text>
            <Card style={styles.receipt}>
              <Text style={styles.label}>DONATION RECEIPT</Text>
              <View style={styles.row}><Text style={styles.key}>Food Collected</Text><Text style={styles.value}>{donation.foodType} ({donation.quantity} {donation.unit})</Text></View>
              <View style={styles.row}><Text style={styles.key}>Date & Time</Text><Text style={styles.value}>{formatDateTime(collectedAt)}</Text></View>
              {donation.status === 'delivered' ? <View style={styles.row}><Text style={styles.key}>Delivered</Text><Text style={styles.value}>{formatDateTime(donation.deliveredAt)}</Text></View> : null}
              <View style={styles.row}><Text style={styles.key}>Pickup Location</Text><Text style={styles.value}>{donation.pickupLocation}</Text></View>
              <View style={styles.row}><Text style={styles.key}>Partner NGO</Text><Text style={[styles.value, styles.green]}>{donation.ngoName || 'Unavailable'}</Text></View>
              <View style={styles.row}><Text style={styles.key}>Volunteer</Text><Text style={styles.value}>{donation.volunteerName || 'Unavailable'}</Text></View>
            </Card>
          </>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, alignItems: 'center', padding: 24, paddingTop: 72, paddingBottom: 36 },
  loading: { marginTop: 48 },
  error: { color: Colors.danger, fontSize: 13, textAlign: 'center', marginBottom: 12 },
  check: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  title: { fontSize: 23, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
  subtitle: { marginTop: 10, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  receipt: { width: '100%', marginTop: 28, gap: 17 },
  label: { fontSize: 10, fontWeight: '700', color: Colors.textSecondary },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  key: { fontSize: 12, color: Colors.textSecondary },
  value: { flex: 1, textAlign: 'right', fontSize: 12, fontWeight: '700', color: Colors.textPrimary },
  green: { color: Colors.primaryDark },
  footer: { gap: 10 },
});
