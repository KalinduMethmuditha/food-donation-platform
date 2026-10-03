import { router } from 'expo-router';
import { useState } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import AppHeader from '@/components/restaurant/AppHeader';
import StepProgress from '@/components/shared/StepProgress';
import FormField from '@/components/ui/FormField';
import PrimaryButton from '@/components/ui/PrimaryButton';

import { Colors } from '@/constants/colors';
import { useDonationDraftStore } from '@/stores/donationDraft.store';

export default function FoodDetailsScreen() {
  // Donation data comes from Zustand
  const {
    foodType,
    quantity,
    unit,
    description,
    updateFoodDetails,
  } = useDonationDraftStore();

  // Only validation errors stay as local state
  const [foodTypeError, setFoodTypeError] = useState('');
  const [quantityError, setQuantityError] = useState('');

  const handleNext = () => {
    let valid = true;

    setFoodTypeError('');
    setQuantityError('');

    if (!foodType.trim()) {
      setFoodTypeError('Please enter the food type.');
      valid = false;
    }

    if (!quantity.trim()) {
      setQuantityError('Please enter the quantity.');
      valid = false;
    } else if (
      Number.isNaN(Number(quantity)) ||
      Number(quantity) <= 0
    ) {
      setQuantityError('Please enter a valid quantity.');
      valid = false;
    }

    if (!valid) {
      return;
    }

    router.push(
      '/restaurant/create-donation/pickup-details'
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppHeader
        title="Publish Surplus Food"
        showBack
        onBackPress={() => router.back()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <StepProgress currentStep={1} />

        <Text style={styles.heading}>
          Food Details
        </Text>

        <Text style={styles.description}>
          Tell us about the surplus food you would like to donate.
        </Text>

        <View style={styles.formCard}>
          <FormField
            label="FOOD TYPE"
            placeholder="e.g. Rice & Curry"
            value={foodType}
            onChangeText={(value) =>
              updateFoodDetails({
                foodType: value,
              })
            }
            error={foodTypeError}
          />

          <Text style={styles.fieldLabel}>
            QUANTITY
          </Text>

          <View style={styles.quantityRow}>
            <View style={styles.quantityInput}>
              <FormField
                label=""
                placeholder="10"
                value={quantity}
                onChangeText={(value) =>
                  updateFoodDetails({
                    quantity: value,
                  })
                }
                keyboardType="numeric"
                error={quantityError}
              />
            </View>

            <TouchableOpacity
              style={styles.unitButton}
              activeOpacity={0.8}
              onPress={() => {
                // Unit selector can be added later
              }}
            >
              <Text style={styles.unitText}>
                {unit}
              </Text>

              <Text style={styles.chevron}>
                ▾
              </Text>
            </TouchableOpacity>
          </View>

          <FormField
            label="NOTES / DESCRIPTION"
            placeholder="Freshly prepared vegetarian meals. Packed in individual containers."
            value={description}
            onChangeText={(value) =>
              updateFoodDetails({
                description: value,
              })
            }
            multiline
            maxLength={300}
          />

          <Text style={styles.characterCount}>
            {description.length}/300
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title="Next: Pickup Details"
          onPress={handleNext}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  scrollView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
  },

  heading: {
    marginTop: 24,
    fontSize: 21,
    fontWeight: '800',
    color: Colors.textPrimary,
  },

  description: {
    marginTop: 5,
    marginBottom: 18,
    fontSize: 13,
    lineHeight: 19,
    color: Colors.textSecondary,
  },

  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },

  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 7,
  },

  quantityRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },

  quantityInput: {
    flex: 1,
  },

  unitButton: {
    height: 48,
    minWidth: 115,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  unitText: {
    fontSize: 13,
    color: Colors.textPrimary,
  },

  chevron: {
    color: Colors.textSecondary,
  },

  characterCount: {
    marginTop: -10,
    fontSize: 10,
    textAlign: 'right',
    color: Colors.textMuted,
  },

  footer: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 18,
  },
});