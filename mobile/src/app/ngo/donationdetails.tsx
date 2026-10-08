import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { NgoAction, NgoCard, NgoColors, NgoHeader } from '@/components/ngo/NgoUI';
import { useNgoDonation, useNgoDonations } from '@/store/ngoDonations.store';
import { formatDateTime } from '@/utils/dateTime';
import { getDonationStatusLabel, getDonationTimeline } from '@/utils/donation';

export default function NgoDonationDetails() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const donation = useNgoDonation(id);
  const loadDonation = useNgoDonations((state) => state.loadDonation);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(useCallback(() => {
    if (!id) {
      setIsLoading(false);
      setError('Donation not found.');
      return;
    }
    let active = true;
    setIsLoading(true);
    void loadDonation(id).then(() => {
      if (active) setError(null);
    }).catch(() => {
      if (active) setError(useNgoDonations.getState().error ?? 'Could not load this donation.');
    }).finally(() => {
      if (active) setIsLoading(false);
    });
    return () => { active = false; };
  }, [id, loadDonation]));

  return (
    <View style={styles.root}>
      <NgoHeader title="Donation Details" back />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading && !donation ? <ActivityIndicator color={NgoColors.primary} /> : null}
        {error ? <NgoCard><Text accessibilityRole="alert" style={styles.error}>{error}</Text></NgoCard> : null}
        {donation ? (
          <>
            <Image source={require('../../../assets/images/donation-banner.jpg')} style={styles.banner} resizeMode="cover" />
            <Text style={styles.title}>{donation.foodType}</Text>
            <Text style={styles.status}>{getDonationStatusLabel(donation.status)}</Text>
            <NgoCard>
              <Text style={styles.cardTitle}>Donation information</Text>
              <Info label="Quantity" value={`${donation.quantity} ${donation.unit}`} />
              <Info label="Donor" value={`${donation.donorName} (${donation.donorRole})`} />
              <Info label="Pickup location" value={donation.pickupLocation} />
              <Info label="Pickup deadline" value={formatDateTime(donation.pickupDeadline)} />
              {donation.volunteerName ? <Info label="Volunteer" value={donation.volunteerName} /> : null}
            </NgoCard>
            <NgoCard>
              <Text style={styles.cardTitle}>Description</Text>
              <Text style={styles.body}>{donation.description || 'No additional description provided.'}</Text>
            </NgoCard>
            {donation.statusLogs && donation.statusLogs.length > 0 ? (
              <NgoCard>
                <Text style={styles.cardTitle}>Progress</Text>
                {getDonationTimeline(donation.status, donation.statusLogs).map((step) => (
                  <Info key={step.title} label={step.title} value={step.time ?? (step.status === 'pending' ? 'Pending' : step.status === 'current' ? 'Current step' : 'Completed')} />
                ))}
              </NgoCard>
            ) : null}
            {donation.status === 'published' ? (
              <NgoAction label="Review and Accept" onPress={() => router.push({ pathname: '/ngo/donationrequest' as any, params: { id: donation.id } })} />
            ) : donation.status === 'accepted' ? (
              <NgoAction label="Assign Volunteer" onPress={() => router.push({ pathname: '/ngo/assignvolunteer' as any, params: { id: donation.id } })} />
            ) : (
              <NgoAction label="Track Collection" onPress={() => router.push({ pathname: '/ngo/activecollection' as any, params: { id: donation.id } })} />
            )}
          </>
        ) : !isLoading ? <NgoCard><Text style={styles.body}>Donation not found.</Text></NgoCard> : null}
      </ScrollView>
    </View>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <View style={styles.infoRow}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: NgoColors.bg },
  content: { padding: 16, paddingBottom: 40, gap: 14 },
  banner: { width: '100%', height: 150, borderRadius: 16 },
  title: { color: NgoColors.text, fontSize: 23, fontWeight: '800' },
  status: { color: NgoColors.primaryDark, fontWeight: '700' },
  cardTitle: { color: NgoColors.text, fontWeight: '800', fontSize: 16, marginBottom: 6 },
  body: { color: NgoColors.muted, lineHeight: 21 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: NgoColors.border },
  infoLabel: { color: NgoColors.muted, fontSize: 13, flex: 1 },
  infoValue: { color: NgoColors.text, fontSize: 13, fontWeight: '600', flex: 1.5, textAlign: 'right' },
  error: { color: NgoColors.danger },
});
