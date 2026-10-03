import { router } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import AppHeader from '@/components/restaurant/AppHeader';
import StepProgress from '@/components/shared/StepProgress';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Colors } from '@/constants/colors';
import { useDonationDraftStore } from '@/stores/donationDraft.store';

export default function DonationPreviewScreen() {
  const {
    foodType,
    quantity,
    unit,
    description,
    pickupLocation,
    pickupDeadline,
    resetDraft,
  } = useDonationDraftStore();

  const handlePublish = () => {
    // Later this will call Laravel API.
    console.log('Publishing donation:', {
      foodType,
      quantity,
      unit,
      description,
      pickupLocation,
      pickupDeadline,
    });

    resetDraft();

    router.replace('/restaurant/donations/demo');
  };

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Donation Preview"
        showBack
        onBackPress={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <StepProgress currentStep={3} />

        <Text style={styles.heading}>
          Review Donation
        </Text>

        <Text style={styles.subtitle}>
          Check your information before publishing.
        </Text>

        {/* Food Details */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Food Details
            </Text>

            <TouchableOpacity
              onPress={() =>
                router.push(
                  '/restaurant/create-donation/food-details'
                )
              }
            >
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <DetailRow
            label="Food Type"
            value={foodType}
          />

          <DetailRow
            label="Quantity"
            value={`${quantity} ${unit}`}
          />

          <DetailRow
            label="Notes"
            value={description || 'No description provided'}
          />
        </View>

        {/* Pickup Details */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Pickup Details
            </Text>

            <TouchableOpacity
              onPress={() =>
                router.push(
                  '/restaurant/create-donation/pickup-details'
                )
              }
            >
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <DetailRow
            label="Pickup Location"
            value={pickupLocation}
          />

          <DetailRow
            label="Pickup Deadline"
            value={pickupDeadline}
          />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>
            Nearby NGOs and volunteers will be notified.
          </Text>

          <Text style={styles.infoText}>
            Your donation will become available after publishing.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title="Confirm & Publish"
          onPress={handlePublish}
        />
      </View>
    </View>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
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

  subtitle: {
    marginTop: 5,
    marginBottom: 18,
    fontSize: 13,
    color: Colors.textSecondary,
  },

  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  editText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },

  detailRow: {
    marginBottom: 14,
  },

  label: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },

  value: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textPrimary,
  },

  infoBox: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 14,
    padding: 14,
  },

  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryDark,
  },

  infoText: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 17,
    color: Colors.textSecondary,
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