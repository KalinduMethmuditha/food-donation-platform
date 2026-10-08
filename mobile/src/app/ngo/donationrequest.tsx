import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { NgoAction, NgoCard, NgoColors, NgoHeader } from '@/components/ngo/NgoUI';
import { useNgoDonation, useNgoDonations } from '@/store/ngoDonations.store';
import { formatDateTime } from '@/utils/dateTime';

export default function NgoDonationRequest() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const donation = useNgoDonation(id);
  const loadDonation = useNgoDonations((state) => state.loadDonation);
  const accept = useNgoDonations((state) => state.accept);
  const isSaving = useNgoDonations((state) => state.isSaving);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleAccept = async () => {
    if (!id || isSaving) return;
    setError(null);
    try {
      await accept(id);
      router.replace({ pathname: '/ngo/assignvolunteer' as any, params: { id } });
    } catch {
      setError(useNgoDonations.getState().error ?? 'Could not accept this donation.');
    }
  };

  return (
    <View style={styles.root}>
      <NgoHeader title="Donation Request" back />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading && !donation ? <ActivityIndicator color={NgoColors.primary} /> : null}
        {error ? <NgoCard><Text accessibilityRole="alert" style={styles.error}>{error}</Text></NgoCard> : null}
        {donation ? (
          <>
            <NgoCard>
              <Text style={styles.label}>DONOR</Text>
              <Text style={styles.title}>{donation.donorName}</Text>
              <Text style={styles.body}>{donation.donorRole === 'restaurant' ? 'Restaurant owner' : 'Household donor'}</Text>
            </NgoCard>
            <NgoCard>
              <Text style={styles.label}>FOOD DONATION</Text>
              <Text style={styles.title}>{donation.foodType}</Text>
              <Text style={styles.body}>{donation.quantity} {donation.unit}</Text>
              <Text style={styles.body}>Pickup: {donation.pickupLocation}</Text>
              <Text style={styles.body}>Before: {formatDateTime(donation.pickupDeadline)}</Text>
            </NgoCard>
            <NgoCard>
              <Text style={styles.label}>DONOR NOTE</Text>
              <Text style={styles.body}>{donation.description || 'No additional note provided.'}</Text>
            </NgoCard>
            {donation.status === 'published' ? (
              <>
                <NgoAction label={isSaving ? 'Accepting...' : 'Accept Donation'} disabled={isSaving || isLoading} onPress={() => { void handleAccept(); }} />
                <NgoAction label="Back to Donations" onPress={() => router.replace('/ngo/donations' as any)} />
              </>
            ) : donation.status === 'accepted' ? (
              <NgoAction label="Assign Volunteer" onPress={() => router.replace({ pathname: '/ngo/assignvolunteer' as any, params: { id: donation.id } })} />
            ) : <Text style={styles.body}>This donation has already moved to {donation.status}.</Text>}
          </>
        ) : !isLoading ? <NgoCard><Text style={styles.body}>Donation not found.</Text></NgoCard> : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: NgoColors.bg },
  content: { padding: 16, paddingBottom: 40, gap: 14 },
  label: { color: NgoColors.primaryDark, fontSize: 11, fontWeight: '800', letterSpacing: 0.7, marginBottom: 8 },
  title: { color: NgoColors.text, fontSize: 20, fontWeight: '800' },
  body: { color: NgoColors.muted, fontSize: 13, lineHeight: 20, marginTop: 5 },
  error: { color: NgoColors.danger },
});
