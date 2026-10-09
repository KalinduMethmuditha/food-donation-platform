import { router, useLocalSearchParams } from 'expo-router';
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
import { getApiErrorMessage } from '@/services/apiErrors';

export default function HouseholdFoodDetails() {
  const { donationId } = useLocalSearchParams<{ donationId?: string }>();
  const { foodType, quantity, unit, description, editingDonationId, loadDraftFromDonation, updateFoodDetails } = useDonationDraftStore();
  const { donations, getDonationById } = useHouseholdData();
  const [errors, setErrors] = useState<FoodDetailsErrors>({});
  const [loadError, setLoadError] = useState('');
  useEffect(() => {
    if (!donationId || editingDonationId === donationId) return;
    let active = true;
    const cached = donations.find((item) => item.id === donationId);
    if (cached) {
      loadDraftFromDonation(cached);
    } else {
      void getDonationById(donationId)
        .then((donation) => { if (active) loadDraftFromDonation(donation); })
        .catch((error) => { if (active) setLoadError(getApiErrorMessage(error, 'load')); });
    }
    return () => { active = false; };
  }, [donationId, editingDonationId, donations, getDonationById, loadDraftFromDonation]);
  const next = () => {
    if (donationId && editingDonationId !== donationId) return;
    const nextErrors = validateFoodDetails({ foodType, quantity });
    setErrors(nextErrors);
    if (!unit.trim()) setLoadError('Please enter a unit for the quantity.');
    if (!Object.keys(nextErrors).length && unit.trim()) router.push({
      pathname: '/household/create-donation/pickup-details',
      params: donationId ? { donationId } : undefined,
    });
  };
  return <Screen keyboardAvoiding footer={<PrimaryButton title="Next: Pickup Details" onPress={next} />}>
    <AppHeader title={donationId ? 'Edit Food Donation' : 'New Food Donation'} showBack onBackPress={() => router.replace('/household/dashboard')} />
    <ScrollView contentContainerStyle={formStyles.content} keyboardShouldPersistTaps="handled">
      <StepProgress currentStep={1} />
      <Text style={formStyles.heading}>Food Details</Text>
      <Text style={formStyles.description}>Tell us about the safe surplus food you would like to share.</Text>
      <Card>
        <FormField label="Food title & description" placeholder="e.g. Cooked Rice and Lentils" value={foodType} onChangeText={(value) => { updateFoodDetails({ foodType: value }); setErrors((current) => ({ ...current, foodType: undefined })); }} error={errors.foodType} />
        <View style={styles.row}><View style={styles.half}><FormField label="Estimated quantity" placeholder="e.g. 3.5" value={quantity} onChangeText={(value) => { updateFoodDetails({ quantity: value }); setErrors((current) => ({ ...current, quantity: undefined })); }} error={errors.quantity} keyboardType="decimal-pad" /></View><View style={styles.half}><FormField label="Unit" placeholder="portions or kg" value={unit} onChangeText={(value) => { updateFoodDetails({ unit: value }); setLoadError(''); }} maxLength={50} /></View></View>
        <FormField label="Dietary / handling notes" placeholder="Vegetarian. Packed into clean containers." value={description} onChangeText={(value) => updateFoodDetails({ description: value })} multiline />
      </Card>
      {loadError ? <Text accessibilityRole="alert" style={styles.error}>{loadError}</Text> : null}
    </ScrollView>
  </Screen>;
}
const styles = StyleSheet.create({ row: { flexDirection: 'row', gap: 10 }, half: { flex: 1 }, error: { color: Colors.danger, marginTop: 12 } });
