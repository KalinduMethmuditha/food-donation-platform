import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AppHeader from '@/components/shared/AppHeader';
import Screen from '@/components/shared/Screen';
import StepProgress from '@/components/shared/StepProgress';
import Card from '@/components/ui/Card';
import FormField from '@/components/ui/FormField';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Colors } from '@/constants/colors';
import { donationFormStyles as formStyles } from '@/constants/donationFormStyles';
import { useDonationDraftStore } from '@/stores/donationDraft.store';
import { useHouseholdData } from '@/components/household/HouseholdDataProvider';
import { type FoodDetailsErrors, validateFoodDetails } from '@/utils/donationValidation';

export default function HouseholdFoodDetails() {
  const { donationId } = useLocalSearchParams<{ donationId?: string }>();
  const { foodType, quantity, description, updateFoodDetails } = useDonationDraftStore();
  const { donations } = useHouseholdData();
  const [errors, setErrors] = useState<FoodDetailsErrors>({});
  useEffect(() => {
    const donation = donationId ? donations.find((item) => item.id === donationId) : undefined;
    if (donation) updateFoodDetails({ foodType: donation.foodType, quantity: String(donation.quantity), unit: donation.unit, description: donation.description });
  }, [donationId, donations, updateFoodDetails]);
  const next = () => { const nextErrors = validateFoodDetails({ foodType, quantity }); setErrors(nextErrors); if (!Object.keys(nextErrors).length) router.push({ pathname: '/household/create-donation/pickup-details', params: donationId ? { donationId } : undefined }); };
  return <Screen keyboardAvoiding footer={<PrimaryButton title="Review & Publish" onPress={next} />}>
    <AppHeader title={donationId ? 'Edit Food Donation' : 'New Food Donation'} showBack onBackPress={() => router.replace('/household/dashboard')} />
    <ScrollView contentContainerStyle={formStyles.content} keyboardShouldPersistTaps="handled">
      <StepProgress currentStep={1} />
      <Text style={formStyles.heading}>Food Details</Text>
      <Text style={formStyles.description}>Tell us about the safe surplus food you would like to share.</Text>
      <Card>
        <FormField label="Food title & description" placeholder="e.g. Cooked Rice and Lentils" value={foodType} onChangeText={(value) => { updateFoodDetails({ foodType: value }); setErrors((current) => ({ ...current, foodType: undefined })); }} error={errors.foodType} />
        <View style={styles.row}><View style={styles.half}><FormField label="Estimated quantity" placeholder="e.g. 3.5" value={quantity} onChangeText={(value) => { updateFoodDetails({ quantity: value }); setErrors((current) => ({ ...current, quantity: undefined })); }} error={errors.quantity} keyboardType="decimal-pad" /></View><View style={styles.half}><FormField label="Unit" value="portions" editable={false} /></View></View>
        <FormField label="Dietary / handling notes" placeholder="Vegetarian. Packed into clean containers." value={description} onChangeText={(value) => updateFoodDetails({ description: value })} multiline />
      </Card>
    </ScrollView>
  </Screen>;
}
const styles = StyleSheet.create({ row: { flexDirection: 'row', gap: 10 }, half: { flex: 1 }, });
