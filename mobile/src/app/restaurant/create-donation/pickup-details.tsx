import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import AppHeader from '@/components/shared/AppHeader';
import Screen from '@/components/shared/Screen';
import PickupMap from '@/components/shared/PickupMap';
import StepProgress from '@/components/shared/StepProgress';
import Card from '@/components/ui/Card';
import FormField from '@/components/ui/FormField';
import PickupDeadlineField from '@/components/restaurant/PickupDeadlineField';
import Icon from '@/components/ui/Icon';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { Colors } from '@/constants/colors';
import { donationFormStyles as formStyles } from '@/constants/donationFormStyles';
import { useDonationDraftStore } from '@/stores/donationDraft.store';
import {
  type PickupDetailsErrors,
  validateFoodDetails,
  validatePickupDetails,
} from '@/utils/donationValidation';

export default function PickupDetailsScreen() {
  const { editing } = useLocalSearchParams<{ editing?: string }>();
  const isEditing = editing === 'preview';
  const { foodType, quantity, unit, pickupLocation, pickupDeadline, pickupLatitude, pickupLongitude, updatePickupDetails } =
    useDonationDraftStore();
  const [errors, setErrors] = useState<PickupDetailsErrors>({});

  useFocusEffect(
    useCallback(() => {
      // A direct link cannot skip the required food details.
      if (Object.keys(validateFoodDetails(useDonationDraftStore.getState())).length > 0) {
        router.dismissTo('/restaurant/create-donation/food-details');
      }
    }, [])
  );

  const handleBack = () => {
    router.dismissTo(
      isEditing
        ? '/restaurant/create-donation/preview'
        : '/restaurant/create-donation/food-details'
    );
  };

  const handleNext = () => {
    const nextErrors = validatePickupDetails({ pickupLocation, pickupDeadline, pickupLatitude, pickupLongitude });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    if (isEditing) {
      router.dismissTo('/restaurant/create-donation/preview');
    } else {
      router.push('/restaurant/create-donation/preview');
    }
  };

  return (
    <Screen
      keyboardAvoiding
      footer={
        <View style={formStyles.footer}>
          <View style={formStyles.footerButtons}>
            <SecondaryButton title="Back" style={formStyles.backButton} onPress={handleBack} />
            <PrimaryButton
              title={isEditing ? 'Return to Preview' : 'Next: Preview'}
              style={formStyles.nextButton}
              onPress={handleNext}
            />
          </View>
        </View>
      }
    >
      <AppHeader title="Publish Surplus Food" showBack onBackPress={handleBack} />
      <ScrollView
        style={formStyles.scroll}
        contentContainerStyle={formStyles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <StepProgress currentStep={2} />
        <Text style={formStyles.heading}>Pickup Details</Text>
        <Text style={formStyles.description}>
          Provide the location and latest time the food can be collected.
        </Text>

        <Card>
          <FormField
            label="Pickup Location"
            placeholder="e.g. Green Leaf Restaurant, Main Entrance"
            value={pickupLocation}
            onChangeText={(value) => {
              updatePickupDetails({ pickupLocation: value });
              setErrors((current) => ({ ...current, pickupLocation: undefined }));
            }}
            error={errors.pickupLocation}
            autoCapitalize="words"
            maxLength={200}
            multiline
            style={styles.addressInput}
          />

          <Text style={formStyles.fieldLabel}>Pickup Point</Text>
          <PickupMap latitude={pickupLatitude} longitude={pickupLongitude}
            onLocationChange={(latitude, longitude) => {
              updatePickupDetails({ pickupLatitude: latitude, pickupLongitude: longitude });
              setErrors((current) => ({ ...current, pickupCoordinates: undefined }));
            }} />
          {errors.pickupCoordinates ? <Text accessibilityRole="alert" style={styles.coordinateError}>{errors.pickupCoordinates}</Text> : null}

          <PickupDeadlineField
            value={pickupDeadline}
            onChange={(value) => {
              updatePickupDetails({ pickupDeadline: value });
              setErrors((current) => ({ ...current, pickupDeadline: undefined }));
            }}
            error={errors.pickupDeadline}
          />
        </Card>

        <Text style={styles.summaryHeading}>Food Summary</Text>
        <Card style={styles.summaryCard}>
          <View style={styles.foodIcon}>
            <Icon name="leaf" size={26} color={Colors.primaryDark} />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.foodName}>{foodType}</Text>
            <Text style={styles.quantity}>{quantity} {unit}</Text>
          </View>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  addressInput: { minHeight: 76 },
  coordinateError: { color: Colors.danger, fontSize: 12, marginBottom: 16 },
  summaryHeading: {
    marginTop: 22,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  summaryCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  foodIcon: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryContent: { flex: 1 },
  foodName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  quantity: { marginTop: 4, fontSize: 13, color: Colors.textSecondary },
});
