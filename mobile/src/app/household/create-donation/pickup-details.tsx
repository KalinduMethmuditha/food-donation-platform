import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import AppHeader from '@/components/shared/AppHeader';
import Screen from '@/components/shared/Screen';
import StepProgress from '@/components/shared/StepProgress';
import Card from '@/components/ui/Card';
import FormField from '@/components/ui/FormField';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { donationFormStyles as formStyles } from '@/constants/donationFormStyles';
import { useDonationDraftStore } from '@/stores/donationDraft.store';
import { useHouseholdData } from '@/components/household/HouseholdDataProvider';
import { type PickupDetailsErrors, validatePickupDetails } from '@/utils/donationValidation';

export default function HouseholdPickupDetails() {
  const { donationId } = useLocalSearchParams<{ donationId?: string }>();
  const { pickupLocation, pickupDeadline, updatePickupDetails } = useDonationDraftStore();
  const { donations } = useHouseholdData();
  const [errors, setErrors] = useState<PickupDetailsErrors>({});
  useEffect(() => {
    const donation = donationId ? donations.find((item) => item.id === donationId) : undefined;
    if (donation) updatePickupDetails({ pickupLocation: donation.pickupLocation, pickupDeadline: donation.pickupDeadline });
  }, [donationId, donations, updatePickupDetails]);
  const next = () => { const nextErrors = validatePickupDetails({ pickupLocation, pickupDeadline }); setErrors(nextErrors); if (!Object.keys(nextErrors).length) router.push({ pathname: '/household/create-donation/preview', params: donationId ? { donationId } : undefined }); };
  return <Screen keyboardAvoiding footer={<Text style={formStyles.footer}><SecondaryButton title="Back" onPress={() => router.back()} /><PrimaryButton title="Next: Preview" onPress={next} /></Text>}>
    <AppHeader title={donationId ? 'Edit Food Donation' : 'New Food Donation'} showBack onBackPress={() => router.back()} />
    <ScrollView contentContainerStyle={formStyles.content} keyboardShouldPersistTaps="handled">
      <StepProgress currentStep={2} /><Text style={formStyles.heading}>Pickup Details</Text><Text style={formStyles.description}>Where and when can a volunteer collect the donation?</Text>
      <Card><FormField label="Pickup address" placeholder="123 Maple Street, Apartment 4B" value={pickupLocation} onChangeText={(value) => { updatePickupDetails({ pickupLocation: value }); setErrors((current) => ({ ...current, pickupLocation: undefined })); }} error={errors.pickupLocation} /><FormField label="Pickup deadline" placeholder="Today, 8:00 PM" value={pickupDeadline} onChangeText={(value) => { updatePickupDetails({ pickupDeadline: value }); setErrors((current) => ({ ...current, pickupDeadline: undefined })); }} error={errors.pickupDeadline} /></Card>
    </ScrollView>
  </Screen>;
}
