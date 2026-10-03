import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
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
import { type FoodDetailsErrors, validateFoodDetails } from '@/utils/donationValidation';

export default function FoodDetailsScreen() {
  const { editing } = useLocalSearchParams<{ editing?: string }>();
  const isEditing = editing === 'preview';
  const { foodType, quantity, unit, description, updateFoodDetails } = useDonationDraftStore();
  const [errors, setErrors] = useState<FoodDetailsErrors>({});

  const handleBack = () => {
    if (isEditing) {
      router.dismissTo('/restaurant/create-donation/preview');
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/restaurant/dashboard');
    }
  };

  const handleNext = () => {
    const nextErrors = validateFoodDetails({ foodType, quantity });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (isEditing) {
      router.dismissTo('/restaurant/create-donation/preview');
    } else {
      router.push('/restaurant/create-donation/pickup-details');
    }
  };

  return (
    <Screen
      keyboardAvoiding
      footer={
        <View style={formStyles.footer}>
          <PrimaryButton
            title={isEditing ? 'Return to Preview' : 'Next: Pickup Details'}
            onPress={handleNext}
          />
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
        <StepProgress currentStep={1} />
        <Text style={formStyles.heading}>Food Details</Text>
        <Text style={formStyles.description}>
          Tell us about the surplus food you would like to donate.
        </Text>

        <Card>
          <FormField
            label="Food Type"
            placeholder="e.g. Rice & Curry"
            value={foodType}
            onChangeText={(value) => {
              updateFoodDetails({ foodType: value });
              setErrors((current) => ({ ...current, foodType: undefined }));
            }}
            error={errors.foodType}
            autoCapitalize="sentences"
            maxLength={100}
          />

          <View style={styles.quantityRow}>
            <View style={styles.quantityInput}>
              <FormField
                label="Quantity"
                placeholder="10"
                value={quantity}
                onChangeText={(value) => {
                  updateFoodDetails({ quantity: value });
                  setErrors((current) => ({ ...current, quantity: undefined }));
                }}
                keyboardType="decimal-pad"
                error={errors.quantity}
                maxLength={12}
              />
            </View>
            <View style={styles.unitContainer}>
              <Text style={formStyles.fieldLabel}>Unit</Text>
              <View style={styles.unitValue}>
                <Text style={styles.unitText}>{unit}</Text>
              </View>
            </View>
          </View>

          <FormField
            label="Notes / Description"
            placeholder="Freshly prepared vegetarian meals. Packed in individual containers."
            value={description}
            onChangeText={(value) => updateFoodDetails({ description: value })}
            multiline
            maxLength={300}
            hint="Optional — include ingredients or packaging details."
          />
          <Text style={styles.characterCount}>{description.length}/300</Text>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  quantityRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  quantityInput: { flex: 1 },
  unitContainer: { width: 110 },
  unitValue: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  unitText: { fontSize: 14, color: Colors.textSecondary },
  characterCount: { fontSize: 12, textAlign: 'right', color: Colors.textSecondary },
});
