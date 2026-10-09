import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { NgoAction, NgoCard, NgoColors, NgoHeader } from '@/components/ngo/NgoUI';
import { useNgoDonation, useNgoDonations } from '@/store/ngoDonations.store';

export default function AssignVolunteer() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const donation = useNgoDonation(id);
  const volunteers = useNgoDonations((state) => state.volunteers);
  const loadDonation = useNgoDonations((state) => state.loadDonation);
  const loadVolunteers = useNgoDonations((state) => state.loadVolunteers);
  const assign = useNgoDonations((state) => state.assign);
  const isSaving = useNgoDonations((state) => state.isSaving);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(useCallback(() => {
    let active = true;
    setIsLoading(true);
    setError(null);
    if (!id) {
      setIsLoading(false);
      setError('Donation not found.');
      return;
    }
    void Promise.all([loadDonation(id), loadVolunteers()]).then(() => {
      if (active) setSelectedId(null);
    }).catch(() => {
      if (active) setError(useNgoDonations.getState().error ?? 'Could not load available volunteers.');
    }).finally(() => {
      if (active) setIsLoading(false);
    });
    return () => { active = false; };
  }, [id, loadDonation, loadVolunteers]));

  const selected = volunteers.find((item) => item.id === selectedId);

  const refreshVolunteers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await loadVolunteers();
    } catch {
      setError(useNgoDonations.getState().error ?? 'Could not load available volunteers.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!id || !selectedId || isSaving) return;
    setError(null);
    try {
      await assign(id, selectedId);
      router.replace({ pathname: '/ngo/activecollection' as any, params: { id } });
    } catch {
      setError(useNgoDonations.getState().error ?? 'Could not assign this volunteer.');
      void loadVolunteers().catch(() => {});
    }
  };

  return (
    <View style={styles.root}>
      <NgoHeader title="Assign Volunteer" back />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? <ActivityIndicator color={NgoColors.primary} /> : null}
        {error ? <NgoCard><Text accessibilityRole="alert" style={styles.error}>{error}</Text></NgoCard> : null}
        {donation ? (
          <NgoCard>
            <Text style={styles.title}>{donation.foodType}</Text>
            <Text style={styles.body}>{donation.quantity} {donation.unit} · {donation.donorName}</Text>
            <Text style={styles.body}>Pickup: {donation.pickupLocation}</Text>
          </NgoCard>
        ) : !isLoading ? <NgoCard><Text style={styles.body}>Donation not found.</Text></NgoCard> : null}

        {donation?.status === 'accepted' ? (
          <>
            <Text style={styles.sectionTitle}>Available volunteers</Text>
            <Text style={styles.body}>Volunteers appear after turning on “Available for pickups” in their dashboard.</Text>
            {volunteers.length === 0 && !isLoading && !error ? <NgoCard><Text style={styles.body}>No volunteers are available right now. Ask a volunteer to turn on availability, then refresh this list.</Text></NgoCard> : null}
            <View style={styles.list}>
              {volunteers.map((volunteer) => (
                <Pressable key={volunteer.id} onPress={() => setSelectedId(volunteer.id)} accessibilityRole="radio" accessibilityState={{ checked: selectedId === volunteer.id }} style={[styles.volunteer, selectedId === volunteer.id && styles.selected]}>
                  <View style={styles.avatar}><Text style={styles.avatarText}>{volunteer.name.trim().split(/\s+/).map((part) => part[0]?.toUpperCase()).slice(0, 2).join('')}</Text></View>
                  <View style={styles.volunteerBody}><Text style={styles.volunteerName}>{volunteer.name}</Text><Text style={styles.available}>Available</Text></View>
                  <View style={[styles.radio, selectedId === volunteer.id && styles.radioSelected]} />
                </Pressable>
              ))}
            </View>
            <NgoAction label={isLoading ? 'Refreshing...' : 'Refresh volunteers'} disabled={isLoading || isSaving} onPress={() => { void refreshVolunteers(); }} />
            <NgoAction label={isSaving ? 'Assigning...' : selected ? `Assign ${selected.name}` : 'Select a Volunteer'} disabled={!selected || isSaving || isLoading} onPress={() => { void handleAssign(); }} />
          </>
        ) : donation ? <NgoCard><Text style={styles.body}>This donation is already {donation.status}. It cannot be assigned again.</Text></NgoCard> : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: NgoColors.bg },
  content: { padding: 16, paddingBottom: 40, gap: 12 },
  title: { color: NgoColors.text, fontSize: 18, fontWeight: '800' },
  body: { color: NgoColors.muted, fontSize: 13, lineHeight: 20, marginTop: 3 },
  sectionTitle: { color: NgoColors.text, fontSize: 17, fontWeight: '800', marginTop: 8 },
  list: { gap: 10 },
  volunteer: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 16, borderWidth: 1.5, borderColor: NgoColors.border, backgroundColor: NgoColors.card },
  selected: { borderColor: NgoColors.primary },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: NgoColors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: NgoColors.white, fontWeight: '800' },
  volunteerBody: { flex: 1 },
  volunteerName: { color: NgoColors.text, fontWeight: '800' },
  available: { color: NgoColors.primaryDark, fontSize: 12, marginTop: 3 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: NgoColors.border },
  radioSelected: { borderColor: NgoColors.primaryDark, backgroundColor: NgoColors.primaryDark },
  error: { color: NgoColors.danger },
});
