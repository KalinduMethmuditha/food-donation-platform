import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import { mockActivePickup, mockVolunteer } from '@/data/mockVolunteerData';
import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';
import { useVolunteerStore } from '@/store/volunteerStore';

type SummaryRow = { label: string; value: string };

export default function ConfirmationScreen() {
  const pickup = mockActivePickup;
  const { pickupStatus, collectedTime, deliveredTime } = useVolunteerStore();

  const isDelivered = pickupStatus === 'DELIVERED';

  const summaryRows: SummaryRow[] = [
    { label: 'Donor', value: pickup.donor },
    { label: 'Items Collected', value: `${pickup.quantity}` },
    { label: 'Collected Time', value: collectedTime || 'Pending...' },
  ];

  if (isDelivered && deliveredTime) {
    summaryRows.push({ label: 'Delivered Time', value: deliveredTime });
  }

  summaryRows.push(
    { label: 'Volunteer', value: mockVolunteer.fullName },
    { label: 'Reference ID', value: pickup.referenceId }
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <VolunteerScreenHeader 
        title={isDelivered ? 'Delivery Confirmation' : 'Pickup Confirmation'} 
        onBack={() => router.back()} 
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ─── SUCCESS STATE ─── */}
        <View style={styles.successSection}>
          <View style={styles.checkCircle}>
            <Icon name="check-circle" size={56} color={Colors.white} />
          </View>
          <Text style={styles.confirmedTitle}>
            {isDelivered ? 'Delivery Completed!' : 'Pickup Confirmed!'}
          </Text>
          <Text style={styles.confirmedSub}>
            {isDelivered 
              ? 'The donation has been successfully delivered.'
              : 'The donation has been successfully collected and recorded.'}
          </Text>
        </View>

        {/* ─── COLLECTION SUMMARY ─── */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>
            {isDelivered ? 'Delivery Summary' : 'Collection Summary'}
          </Text>
          <View style={styles.divider} />
          {summaryRows.map((row, i) => (
            <View key={row.label}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{row.label}</Text>
                <Text style={[
                  styles.summaryValue,
                  row.label === 'Reference ID' && styles.refIdValue,
                  !row.value.includes(':') && row.label.includes('Time') && { color: Colors.textMuted }
                ]}>
                  {row.value}
                </Text>
              </View>
              {i < summaryRows.length - 1 && <View style={styles.rowDivider} />}
            </View>
          ))}
        </View>

        {/* ─── REFERENCE TAGS ─── */}
        <View style={styles.tagRow}>
          {pickup.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* ─── BUTTONS ─── */}
        <TouchableOpacity
          onPress={() => router.push('/volunteer/activity')}
          style={styles.outlineBtn}
          accessibilityRole="button"
          accessibilityLabel="View Activity"
        >
          <Icon name="activity" size={17} color={Colors.primaryDark} />
          <Text style={styles.outlineBtnText}>View Activity</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace('/volunteer/dashboard')}
          style={styles.dashboardBtn}
          accessibilityRole="button"
          accessibilityLabel="Back to Dashboard"
        >
          <Icon name="home" size={17} color={Colors.white} />
          <Text style={styles.dashboardBtnText}>Back to Dashboard</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, gap: 16, paddingBottom: 32, alignItems: 'stretch' },

  // Success
  successSection: { alignItems: 'center', paddingVertical: 24, gap: 12 },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30,
    shadowRadius: 12,
    elevation: 6,
  },
  confirmedTitle: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary },
  confirmedSub: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },

  // Summary card
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 0,
  },
  summaryTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },
  divider: { height: 1, backgroundColor: Colors.border, marginBottom: 12 },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  rowDivider: { height: 1, backgroundColor: Colors.border },
  summaryLabel: { fontSize: 13, color: Colors.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  refIdValue: { color: Colors.primaryDark, fontFamily: 'monospace' },

  // Tags
  tagRow: { flexDirection: 'row', gap: 8 },
  tag: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: { fontSize: 12, fontWeight: '600', color: Colors.primaryDark },

  // Buttons
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  outlineBtnText: { fontSize: 14, fontWeight: '600', color: Colors.primaryDark },
  dashboardBtn: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  dashboardBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
});
