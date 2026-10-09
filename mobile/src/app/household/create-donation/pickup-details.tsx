import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AppHeader from '@/components/shared/AppHeader';
import Screen from '@/components/shared/Screen';
import PickupMap from '@/components/shared/PickupMap';
import StepProgress from '@/components/shared/StepProgress';
import Card from '@/components/ui/Card';
import FormField from '@/components/ui/FormField';
import PickupDeadlineField from '@/components/restaurant/PickupDeadlineField';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { donationFormStyles as formStyles } from '@/constants/donationFormStyles';
import { useDonationDraftStore } from '@/stores/donationDraft.store';
import { type PickupDetailsErrors, validatePickupDetails } from '@/utils/donationValidation';
import { Colors } from '@/constants/colors';

export default function HouseholdPickupDetails() {
  const { donationId } = useLocalSearchParams<{ donationId?: string }>();
  const { pickupLocation, pickupDeadline, pickupLatitude, pickupLongitude, editingDonationId, updatePickupDetails } = useDonationDraftStore();
  const [errors, setErrors] = useState<PickupDetailsErrors>({});
  const next = () => {
    if (donationId && editingDonationId !== donationId) {
      router.replace({ pathname: '/household/create-donation/food-details', params: { donationId } });
      return;
    }
    const nextErrors = validatePickupDetails({ pickupLocation, pickupDeadline, pickupLatitude, pickupLongitude });
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) router.push({
      pathname: '/household/create-donation/preview',
      params: donationId ? { donationId } : undefined,
    });
  };
  return <Screen keyboardAvoiding footer={<View style={styles.footer}><SecondaryButton title="Back" style={styles.footerButton} onPress={() => router.back()} /><PrimaryButton title="Next: Preview" style={styles.footerButton} onPress={next} /></View>}>
    <AppHeader title={donationId ? 'Edit Food Donation' : 'New Food Donation'} showBack onBackPress={() => router.back()} />
    <ScrollView contentContainerStyle={formStyles.content} keyboardShouldPersistTaps="handled">
      <StepProgress currentStep={2} /><Text style={formStyles.heading}>Pickup Details</Text><Text style={formStyles.description}>Where and when can a volunteer collect the donation?</Text>
      <Card>
        <FormField label="Pickup address" placeholder="123 Maple Street, Apartment 4B" value={pickupLocation} onChangeText={(value) => { updatePickupDetails({ pickupLocation: value }); setErrors((current) => ({ ...current, pickupLocation: undefined })); }} error={errors.pickupLocation} multiline maxLength={500} />
        <Text style={styles.label}>Pickup point (optional)</Text>
        <PickupMap latitude={pickupLatitude} longitude={pickupLongitude} onLocationChange={(latitude, longitude) => {
          updatePickupDetails({ pickupLatitude: latitude, pickupLongitude: longitude });
          setErrors((current) => ({ ...current, pickupCoordinates: undefined }));
        }} />
        {errors.pickupCoordinates ? <Text accessibilityRole="alert" style={styles.error}>{errors.pickupCoordinates}</Text> : null}
        <PickupDeadlineField value={pickupDeadline} onChange={(value) => {
          updatePickupDetails({ pickupDeadline: value });
          setErrors((current) => ({ ...current, pickupDeadline: undefined }));
        }} error={errors.pickupDeadline} />
      </Card>
    </ScrollView>
  </Screen>;
}
const styles = StyleSheet.create({
  footer: { flexDirection: 'row', gap: 10 },
  footerButton: { flex: 1 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 8 },
  error: { color: Colors.danger, marginBottom: 12 },
});
