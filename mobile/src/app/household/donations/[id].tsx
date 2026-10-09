import DonationBanner from '@/components/shared/DonationBanner';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useHouseholdData } from '@/components/household/HouseholdDataProvider';
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
import { useDonationDraftStore } from '@/stores/donationDraft.store';
import { formatDateTime } from '@/utils/dateTime';
import { getDonationStatusLabel, getDonationTimeline } from '@/utils/donation';

export default function HouseholdDonationDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { donations, getDonationById, deleteDonation, isSaving } = useHouseholdData();
  const loadDraftFromDonation = useDonationDraftStore((state) => state.loadDraftFromDonation);
  const donation = donations.find((item) => item.id === id);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

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

  const handleDelete = async () => {
    if (!donation || isSaving) return;
    try {
      await deleteDonation(donation.id);
      setConfirmDelete(false);
      router.replace('/household/activity');
    } catch (deleteError) {
      setError(getApiErrorMessage(deleteError, 'donation'));
      setConfirmDelete(false);
    }
  };

  const handleEdit = () => {
    if (!donation) return;
    loadDraftFromDonation(donation);
    router.push({ pathname: '/household/create-donation/food-details', params: { donationId: donation.id } });
  };

  return (
    <Screen footer={<PrimaryButton title="View History" onPress={() => router.push('/household/activity')} />}>
      <AppHeader title="Donation Details" showBack onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {isLoading && !donation ? <ActivityIndicator color={Colors.primary} style={styles.loading} /> : null}
        {!isLoading && !donation ? (
          <EmptyState title="Donation not found" description="This donation is no longer available." />
        ) : null}
        {donation ? (
          <>
            <DonationBanner />
            <Card>
              <View style={styles.summary}>
                <View style={styles.icon}><Icon name="heart" size={28} /></View>
                <View style={styles.copy}>
                  <Text style={styles.title}>{donation.foodType}</Text>
                  <Text style={styles.meta}>{donation.quantity} {donation.unit}</Text>
                  <StatusBadge label={getDonationStatusLabel(donation.status)} />
                </View>
              </View>
              {donation.description ? <Text style={styles.description}>{donation.description}</Text> : null}
              <Text style={styles.location}>Pickup: {donation.pickupLocation}</Text>
              <Text style={styles.meta}>Pickup deadline: {formatDateTime(donation.pickupDeadline)}</Text>
              {donation.status === 'published' ? (
                <View style={styles.actions}>
                  <Pressable accessibilityRole="button" style={styles.actionButton} onPress={handleEdit}>
                    <Text style={styles.actionText}>Edit</Text>
                  </Pressable>
                  <Pressable accessibilityRole="button" style={[styles.actionButton, styles.deleteButton]} onPress={() => setConfirmDelete(true)}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </Pressable>
                </View>
              ) : null}
            </Card>
            <Text style={styles.section}>Collection Progress</Text>
            <Card><DonationTimeline items={getDonationTimeline(donation.status, donation.statusLogs)} /></Card>
            <Text style={styles.section}>Collection Team</Text>
            <Card style={styles.teamCard}>
              <Text style={styles.meta}>Partner NGO</Text>
              <Text style={styles.teamName}>{donation.ngoName || 'Awaiting an NGO'}</Text>
              <Text style={styles.meta}>Volunteer</Text>
              <Text style={styles.teamName}>{donation.volunteerName || 'Awaiting assignment'}</Text>
            </Card>
          </>
        ) : null}
      </ScrollView>
      <Modal visible={confirmDelete} transparent animationType="fade" onRequestClose={() => setConfirmDelete(false)}>
        <View style={styles.modalBackdrop}>
          <Card style={styles.modalCard}>
            <Text style={styles.modalTitle}>Delete donation?</Text>
            <Text style={styles.meta}>This will remove the published donation from your activity.</Text>
            <SecondaryButton title="Keep Donation" disabled={isSaving} onPress={() => setConfirmDelete(false)} />
            <PrimaryButton title="Delete Donation" loading={isSaving} style={styles.confirmDelete} onPress={() => { void handleDelete(); }} />
          </Card>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 24 },
  loading: { marginTop: 48 },
  error: { color: Colors.danger, marginBottom: 12, fontSize: 13 },
  summary: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  icon: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, gap: 5 },
  title: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  meta: { fontSize: 12, color: Colors.textSecondary },
  description: { marginTop: 16, fontSize: 13, color: Colors.textPrimary },
  location: { marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: Colors.border, fontSize: 13, color: Colors.textSecondary, marginBottom: 6 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 18, paddingTop: 14, borderTopWidth: 1, borderTopColor: Colors.border },
  actionButton: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 1, borderColor: Colors.primary, backgroundColor: Colors.primaryWash },
  deleteButton: { borderColor: Colors.danger, backgroundColor: Colors.surface },
  actionText: { fontWeight: '700', color: Colors.primaryDark },
  deleteText: { fontWeight: '700', color: Colors.danger },
  section: { marginTop: 22, marginBottom: 10, fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  teamCard: { gap: 6 },
  teamName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  modalBackdrop: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: 'rgba(0, 0, 0, 0.45)' },
  modalCard: { gap: 14 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  confirmDelete: { backgroundColor: Colors.danger },
});
