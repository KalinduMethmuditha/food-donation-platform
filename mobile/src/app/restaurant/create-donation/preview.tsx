import { router, useFocusEffect, useNavigation } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useRestaurantData } from '@/components/restaurant/RestaurantDataProvider';
import AppHeader from '@/components/shared/AppHeader';
import Screen from '@/components/shared/Screen';
import StepProgress from '@/components/shared/StepProgress';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Colors } from '@/constants/colors';
import { donationFormStyles as formStyles } from '@/constants/donationFormStyles';
import { useDonationDraftStore } from '@/stores/donationDraft.store';
import { getApiErrorMessage } from '@/services/apiErrors';
import {
  validateFoodDetails,
  validatePickupDetails,
} from '@/utils/donationValidation';

export default function DonationPreviewScreen() {
  const navigation = useNavigation<{
    reset: (state: { index: number; routes: Array<
      { name: 'dashboard' } | { name: 'donations/[id]'; params: { id: string } }
    > }) => void;
  }>('/restaurant');
  const draft = useDonationDraftStore();
  const { publishDonation, isPublishing } = useRestaurantData();
  const [publishError, setPublishError] = useState('');
  const submitting = useRef(false);

  useFocusEffect(useCallback(() => {
    const state = useDonationDraftStore.getState();
    if (Object.keys(validateFoodDetails(state)).length > 0) {
      router.dismissTo('/restaurant/create-donation/food-details');
    } else if (Object.keys(validatePickupDetails(state)).length > 0) {
      router.dismissTo('/restaurant/create-donation/pickup-details');
    }
  }, []));

  const handlePublish = async () => {
    if (submitting.current) return;
    const foodErrors = validateFoodDetails(draft);
    const pickupErrors = validatePickupDetails(draft);
    if (Object.keys(foodErrors).length || Object.keys(pickupErrors).length) {
      setPublishError('Complete the food and pickup details before publishing.');
      return;
    }

    submitting.current = true;
    setPublishError('');
    try {
      const donation = await publishDonation({
        foodType: draft.foodType,
        quantity: draft.quantity,
        unit: draft.unit,
        description: draft.description,
        pickupLocation: draft.pickupLocation,
        pickupDeadline: draft.pickupDeadline,
      });
      // Leave no cleared wizard screens behind in the Restaurant stack.
      navigation.reset({
        index: 1,
        routes: [
          { name: 'dashboard' },
          { name: 'donations/[id]', params: { id: donation.id } },
        ],
      });
      draft.resetDraft();
    } catch (error) {
      setPublishError(getApiErrorMessage(error, 'donation'));
      submitting.current = false;
    }
  };

  const edit = (step: 'food-details' | 'pickup-details') => {
    router.push({
      pathname: step === 'food-details'
        ? '/restaurant/create-donation/food-details'
        : '/restaurant/create-donation/pickup-details',
      params: { editing: 'preview' },
    });
  };

  return <Screen footer={<View style={formStyles.footer}>
    {publishError ? <Text accessibilityRole="alert" style={styles.error}>{publishError}</Text> : null}
    <PrimaryButton title="Confirm & Publish" onPress={handlePublish} loading={isPublishing} />
  </View>}>
    <AppHeader title="Donation Preview" showBack
      onBackPress={() => router.dismissTo('/restaurant/create-donation/pickup-details')} />
    <ScrollView style={formStyles.scroll} contentContainerStyle={formStyles.content}
      showsVerticalScrollIndicator={false}>
      <StepProgress currentStep={3} />
      <Text style={formStyles.heading}>Review Donation</Text>
      <Text style={formStyles.description}>Check your information before publishing.</Text>

      <Card style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Food Details</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Edit Food Details"
            onPress={() => edit('food-details')} style={styles.editButton}>
            <Text style={styles.editText}>Edit</Text>
          </Pressable>
        </View>
        <DetailRow label="Food Type" value={draft.foodType} />
        <DetailRow label="Quantity" value={`${draft.quantity} ${draft.unit}`} />
        <DetailRow label="Notes" value={draft.description || 'No description provided'} />
      </Card>

      <Card style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pickup Details</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Edit Pickup Details"
            onPress={() => edit('pickup-details')} style={styles.editButton}>
            <Text style={styles.editText}>Edit</Text>
          </Pressable>
        </View>
        <DetailRow label="Pickup Location" value={draft.pickupLocation} />
        <DetailRow label="Pickup Deadline" value={draft.pickupDeadline} />
      </Card>

      <View style={styles.infoBox}>
        <Icon name="info" size={22} />
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>Nearby NGOs and volunteers will be notified.</Text>
          <Text style={styles.infoText}>Your donation will become available after publishing.</Text>
        </View>
      </View>
    </ScrollView>
  </Screen>;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return <View style={styles.detailRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>;
}

const styles = StyleSheet.create({
  card: { marginBottom: 14 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  editButton: { minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center' },
  editText: { fontSize: 14, fontWeight: '700', color: Colors.primaryDark },
  detailRow: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  value: { marginTop: 4, fontSize: 14, lineHeight: 20, color: Colors.textPrimary },
  infoBox: { flexDirection: 'row', gap: 10, borderRadius: 14, padding: 16, backgroundColor: Colors.primaryLight },
  infoContent: { flex: 1 },
  infoTitle: { fontSize: 14, fontWeight: '700', color: Colors.primaryDark },
  infoText: { marginTop: 4, fontSize: 12, lineHeight: 18, color: Colors.textSecondary },
  error: { color: Colors.danger, fontSize: 13 },
});
