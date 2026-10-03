import { router } from 'expo-router';
import { useState } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AppHeader from '@/components/restaurant/AppHeader';
import StepProgress from '@/components/shared/StepProgress';
import FormField from '@/components/ui/FormField';
import PrimaryButton from '@/components/ui/PrimaryButton';

import { Colors } from '@/constants/colors';
import { useDonationDraftStore } from '@/stores/donationDraft.store';

export default function PickupDetailsScreen() {
  const {
    foodType,
    quantity,
    unit,
    pickupLocation,
    pickupDeadline,
    updatePickupDetails,
  } = useDonationDraftStore();

  const [locationError, setLocationError] = useState('');
  const [deadlineError, setDeadlineError] = useState('');

  const handleNext = () => {
    let valid = true;

    setLocationError('');
    setDeadlineError('');

    if (!pickupLocation.trim()) {
      setLocationError('Please enter a pickup location.');
      valid = false;
    }

    if (!pickupDeadline.trim()) {
      setDeadlineError('Please enter a pickup deadline.');
      valid = false;
    }

    if (!valid) {
      return;
    }

    router.push(
      '/restaurant/create-donation/preview'
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
        <StepProgress currentStep={2} />

        <Text style={styles.heading}>
          Pickup Details
        </Text>

        <Text style={styles.description}>
          Provide the location and latest time the food can
          be collected.
        </Text>

        <View style={styles.formCard}>
          <FormField
            label="PICKUP LOCATION"
            placeholder="e.g. Green Leaf Restaurant, Main Entrance"
            value={pickupLocation}
            onChangeText={(value) =>
              updatePickupDetails({
                pickupLocation: value,
              })
            }
            error={locationError}
          />

          <Text style={styles.mapLabel}>
            LOCATION PREVIEW
          </Text>

          <View style={styles.mapPlaceholder}>
            <View style={styles.mapRoadHorizontal} />
            <View style={styles.mapRoadVertical} />

            <View style={styles.locationPin}>
              <View style={styles.locationPinCenter} />
            </View>

            <Text style={styles.mapText}>
              Map preview
            </Text>
          </View>

          <FormField
            label="PICKUP DEADLINE"
            placeholder="e.g. Today, 3:00 PM"
            value={pickupDeadline}
            onChangeText={(value) =>
              updatePickupDetails({
                pickupDeadline: value,
              })
            }
            error={deadlineError}
          />
        </View>

        <Text style={styles.summaryHeading}>
          Food Summary
        </Text>

        <View style={styles.summaryCard}>
          <View style={styles.foodPlaceholder} />

          <View style={styles.summaryContent}>
            <Text style={styles.foodName}>
              {foodType || 'Food donation'}
            </Text>

            <Text style={styles.quantity}>
              {quantity || '0'} {unit}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerButtons}>
          <PrimaryButton
            title="Back"
            style={styles.backButton}
            onPress={() => router.back()}
          />

          <PrimaryButton
            title="Next: Preview"
            style={styles.nextButton}
            onPress={handleNext}
          />
        </View>
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

  mapLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 7,
  },

  mapPlaceholder: {
    height: 150,
    overflow: 'hidden',
    borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  mapRoadHorizontal: {
    position: 'absolute',
    width: '120%',
    height: 18,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '-10deg' }],
  },

  mapRoadVertical: {
    position: 'absolute',
    width: 18,
    height: '140%',
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '25deg' }],
  },

  locationPin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  locationPinCenter: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
  },

  mapText: {
    marginTop: 7,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: Colors.surface,
    fontSize: 10,
    color: Colors.textSecondary,
  },

  summaryHeading: {
    marginTop: 20,
    marginBottom: 9,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  summaryCard: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
  },

  foodPlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 10,
    backgroundColor: '#E7E9E8',
  },

  summaryContent: {
    marginLeft: 12,
  },

  foodName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  quantity: {
    marginTop: 3,
    fontSize: 12,
    color: Colors.textSecondary,
  },

  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 18,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },

  footerButtons: {
    flexDirection: 'row',
    gap: 10,
  },

  backButton: {
    flex: 1,
    backgroundColor: Colors.textSecondary,
  },

  nextButton: {
    flex: 2,
  },
});