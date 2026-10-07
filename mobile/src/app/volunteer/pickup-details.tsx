import { router } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import { mockActivePickup } from '@/data/mockVolunteerData';
import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';
import { useVolunteerStore } from '@/store/volunteerStore';

export default function PickupDetailsScreen() {
  const pickup = mockActivePickup;
  const { setPickupStatus } = useVolunteerStore();

  const handleCallDonor = async () => {
    const phoneNumber = `tel:${pickup.phone.replace(
      /[^0-9+]/g,
      ''
    )}`;

    try {
      const supported = await Linking.canOpenURL(phoneNumber);

      if (supported) {
        await Linking.openURL(phoneNumber);
      } else {
        Alert.alert(
          'Not Supported',
          'Calling is not supported on this device.'
        );
      }
    } catch (err) {
      Alert.alert(
        'Error',
        'An error occurred while trying to make a call.'
      );
    }
  };

  const handleMessage = async () => {
    const phoneNumber = `sms:${pickup.phone.replace(
      /[^0-9+]/g,
      ''
    )}`;

    try {
      const supported = await Linking.canOpenURL(phoneNumber);

      if (supported) {
        await Linking.openURL(phoneNumber);
      } else {
        Alert.alert(
          'Not Supported',
          'Messaging is not supported on this device.'
        );
      }
    } catch (err) {
      Alert.alert(
        'Error',
        'An error occurred while trying to open messages.'
      );
    }
  };

  const handleStartRoute = () => {
    setPickupStatus('ON_WAY');
    router.push('/volunteer/route');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <VolunteerScreenHeader
        title="Pickup Details"
        onBack={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── DONOR CARD ─── */}
        <View style={styles.donorCard}>
          <View style={styles.donorIconBox}>
            <Icon
              name="building"
              size={24}
              color={Colors.primaryDark}
            />
          </View>

          <View style={styles.donorInfo}>
            <Text style={styles.donorName}>
              {pickup.donor}
            </Text>

            <View style={styles.metaRow}>
              <Icon
                name="pin"
                size={13}
                color={Colors.textSecondary}
              />
              <Text style={styles.metaText}>
                {pickup.address}
              </Text>
            </View>

            <View style={styles.metaRow}>
              <Icon
                name="phone"
                size={13}
                color={Colors.textSecondary}
              />
              <Text style={styles.metaText}>
                {pickup.phone}
              </Text>
            </View>
          </View>
        </View>

        {/* ─── PICKUP INFORMATION ─── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Pickup Information
          </Text>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Icon
                name="package"
                size={16}
                color={Colors.primaryDark}
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Food Type</Text>
              <Text style={styles.infoValue}>
                {pickup.foodType}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Icon
                name="info"
                size={16}
                color={Colors.primaryDark}
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Quantity</Text>
              <Text style={styles.infoValue}>
                {pickup.quantity}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Icon
                name="clock"
                size={16}
                color={Colors.primaryDark}
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>
                Pickup Window
              </Text>
              <Text style={styles.infoValue}>
                {pickup.pickupWindow}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Icon
                name="users"
                size={16}
                color={Colors.primaryDark}
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>
                Estimated Recipients
              </Text>
              <Text style={styles.infoValue}>
                {pickup.estimatedRecipients}
              </Text>
            </View>
          </View>
        </View>

        {/* ─── SPECIAL NOTES ─── */}
        <View style={styles.notesCard}>
          <View style={styles.notesTitleRow}>
            <Icon
              name="alert-triangle"
              size={16}
              color={Colors.warning}
            />

            <Text style={styles.notesTitle}>
              Special Notes
            </Text>
          </View>

          <Text style={styles.noteText}>
            • Please arrive before 5:00 PM.
          </Text>

          <Text style={styles.noteText}>
            • Handle food carefully and keep upright during
            transport.
          </Text>
        </View>

        {/* ─── REF TAGS ─── */}
        <View style={styles.tagRow}>
          {pickup.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* ─── ACTION BUTTONS ─── */}
        <View style={styles.secondaryBtnRow}>
          <TouchableOpacity
            onPress={handleCallDonor}
            style={styles.outlineBtn}
            accessibilityRole="button"
            accessibilityLabel="Call Donor"
          >
            <Icon
              name="phone"
              size={16}
              color={Colors.primaryDark}
            />
            <Text style={styles.outlineBtnText}>
              Call Donor
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleMessage}
            style={styles.outlineBtn}
            accessibilityRole="button"
            accessibilityLabel="Message Donor"
          >
            <Icon
              name="message"
              size={16}
              color={Colors.primaryDark}
            />
            <Text style={styles.outlineBtnText}>
              Message
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleStartRoute}
          style={styles.startRouteBtn}
          accessibilityRole="button"
          accessibilityLabel="Start Route"
        >
          <Icon
            name="route"
            size={18}
            color={Colors.white}
          />

          <Text style={styles.startRouteBtnText}>
            Start Route
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    padding: 20,
    gap: 14,
    paddingBottom: 32,
  },

  donorCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },

  donorIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.primaryWash,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  donorInfo: {
    flex: 1,
    gap: 5,
  },

  donorName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  metaText: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 12,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  infoIconBox: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: Colors.primaryWash,
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },

  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 1,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 46,
  },

  notesCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    padding: 14,
    gap: 6,
  },

  notesTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },

  notesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  noteText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },

  tagRow: {
    flexDirection: 'row',
    gap: 8,
  },

  tag: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryDark,
  },

  secondaryBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },

  outlineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },

  outlineBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryDark,
  },

  startRouteBtn: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  startRouteBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
});