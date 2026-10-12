import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AppHeader from '@/components/shared/AppHeader';
import Screen from '@/components/shared/Screen';
import StepProgress from '@/components/shared/StepProgress';
import Card from '@/components/ui/Card';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Colors } from '@/constants/colors';
import { useDonationDraftStore } from '@/stores/donationDraft.store';
import { useHouseholdData } from '@/components/household/HouseholdDataProvider';
import { getApiErrorMessage } from '@/services/apiErrors';
import { formatDateTime } from '@/utils/dateTime';
import { validateFoodDetails, validatePickupDetails } from '@/utils/donationValidation';

export default function HouseholdPreview() {
  const { donationId } = useLocalSearchParams<{ donationId?: string }>();
  const draft = useDonationDraftStore();
  const { publishDonation, updateDonation, isSaving } = useHouseholdData();
  const [error, setError] = useState('');
  const publish = async () => {
    if (isSaving) return;
    if (donationId && draft.editingDonationId !== donationId) {
      router.replace({ pathname: '/household/create-donation/food-details', params: { donationId } });
      return;
    }
    if (Object.keys(validateFoodDetails(draft)).length || Object.keys(validatePickupDetails(draft)).length || !draft.unit.trim()) {
      setError('Complete the food and pickup details before saving.');
      return;
    }
    setError('');
    try {
      const donation = donationId ? await updateDonation(donationId, draft) : await publishDonation(draft);
      draft.resetDraft();
      router.replace({ pathname: '/household/donations/[id]', params: { id: donation.id } });
    } catch (caught) {
      setError(getApiErrorMessage(caught, 'donation'));
    }
  };
  return <Screen footer={<PrimaryButton title={donationId ? 'Save Changes' : 'Publish Donation Listing'} loading={isSaving} onPress={() => void publish()} />}><AppHeader title={donationId ? 'Review Changes' : 'Confirm Details'} showBack onBackPress={() => router.back()} /><ScrollView contentContainerStyle={styles.content}><StepProgress currentStep={3} /><Card><View style={styles.rule} /><Text style={styles.label}>Donation item</Text><Text style={styles.title}>{draft.foodType}</Text><Text style={styles.label}>Estimated quantity</Text><Text style={styles.body}>{draft.quantity} {draft.unit}</Text><Text style={styles.label}>Address for pickup</Text><Text style={styles.body}>{draft.pickupLocation}</Text><Text style={styles.label}>Collection / pickup deadline</Text><Text style={styles.deadline}>{formatDateTime(draft.pickupDeadline)}</Text>{draft.description ? <><Text style={styles.label}>Handling notes</Text><Text style={styles.body}>{draft.description}</Text></> : null}</Card>{error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}</ScrollView></Screen>;
}
const styles = StyleSheet.create({ content: { padding: 16, paddingBottom: 24 }, rule: { height: 4, backgroundColor: Colors.primary, borderRadius: 2, marginBottom: 18 }, label: { marginTop: 17, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', color: Colors.textSecondary }, title: { marginTop: 5, fontSize: 17, fontWeight: '700', color: Colors.textPrimary }, body: { marginTop: 5, fontSize: 14, lineHeight: 20, color: Colors.textSecondary }, deadline: { marginTop: 5, fontSize: 14, fontWeight: '700', color: Colors.warning }, error: { marginTop: 12, color: Colors.danger, textAlign: 'center' } });
