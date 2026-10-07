import { router } from 'expo-router';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import { mockActivePickup } from '@/data/mockVolunteerData';
import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';

type StageStatus = 'completed' | 'current' | 'upcoming';

type Stage = { label: string; sub: string; status: StageStatus };

const STAGES: Stage[] = [
  { label: 'Assigned', sub: 'Completed', status: 'completed' },
  { label: 'On the Way', sub: 'Completed', status: 'completed' },
  { label: 'Arrived', sub: 'Current stage', status: 'current' },
  { label: 'Collected', sub: 'Upcoming', status: 'upcoming' },
  { label: 'Delivered', sub: 'Upcoming', status: 'upcoming' },
];

function StageIndicator({ status }: { status: StageStatus }) {
  if (status === 'completed') {
    return (
      <View style={[indicator.circle, indicator.completed]}>
        <Icon name="check" size={13} color={Colors.white} />
      </View>
    );
  }
  if (status === 'current') {
    return (
      <View style={[indicator.circle, indicator.current]}>
        <View style={indicator.currentDot} />
      </View>
    );
  }
  return <View style={[indicator.circle, indicator.upcoming]} />;
}

const indicator = StyleSheet.create({
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completed: { backgroundColor: Colors.primaryDark },
  current: { backgroundColor: Colors.white, borderWidth: 2.5, borderColor: Colors.primaryDark },
  upcoming: { backgroundColor: Colors.white, borderWidth: 2, borderColor: Colors.border },
  currentDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primaryDark,
  },
});

const REPORT_OPTIONS = ['Damaged food', 'Donor unavailable', 'Quantity mismatch', 'Other'];

export default function CollectionStatusScreen() {
  const pickup = mockActivePickup;
  const [reportVisible, setReportVisible] = useState(false);

  const handleReport = (option: string) => {
    setReportVisible(false);
    Alert.alert('Issue Reported', `"${option}" has been flagged for review.`, [{ text: 'OK' }]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <VolunteerScreenHeader title="Collection Status" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ─── COLLECTION PROGRESS ─── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Collection Progress</Text>

          <View style={styles.timeline}>
            {STAGES.map((stage, i) => (
              <View key={stage.label} style={styles.stageRow}>
                {/* Left: connector + indicator */}
                <View style={styles.stageLeft}>
                  {i > 0 && (
                    <View style={[styles.connector, stage.status !== 'upcoming' && styles.connectorActive]} />
                  )}
                  <StageIndicator status={stage.status} />
                  {i < STAGES.length - 1 && (
                    <View style={[styles.connectorBottom, (STAGES[i + 1]?.status !== 'upcoming') && styles.connectorActive]} />
                  )}
                </View>
                {/* Right: label */}
                <View style={styles.stageLabelBox}>
                  <Text style={[styles.stageLabel, stage.status === 'current' && styles.stageLabelActive]}>
                    {stage.label}
                  </Text>
                  <Text style={[
                    styles.stageSub,
                    stage.status === 'completed' && styles.stageSubCompleted,
                    stage.status === 'current' && styles.stageSubCurrent,
                  ]}>
                    {stage.sub}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ─── CURRENT STATUS CARD ─── */}
        <View style={styles.statusCard}>
          <View style={styles.statusIconBox}>
            <Icon name="pin" size={20} color={Colors.primaryDark} />
          </View>
          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>Arrived at pickup location</Text>
            <Text style={styles.statusDesc}>You have reached {pickup.donor}.</Text>
          </View>
        </View>

        {/* ─── ADD UPDATE ─── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Add Update</Text>
          <View style={styles.updateBox}>
            <Text style={styles.updateText}>
              Volunteer has reached the pickup point and is verifying the donation package.
            </Text>
            <Text style={styles.charCount}>93/150</Text>
          </View>
        </View>

        {/* ─── ACTIONS ─── */}
        <TouchableOpacity
          onPress={() => router.push('/volunteer/confirmation')}
          style={styles.markBtn}
          accessibilityRole="button"
          accessibilityLabel="Mark as Collected"
        >
          <Icon name="check-circle" size={19} color={Colors.white} />
          <Text style={styles.markBtnText}>Mark as Collected</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setReportVisible(true)}
          style={styles.reportBtn}
          accessibilityRole="button"
          accessibilityLabel="Report Issue"
        >
          <Icon name="alert-triangle" size={17} color={Colors.danger} />
          <Text style={styles.reportBtnText}>Report Issue</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* ─── REPORT ISSUE MODAL ─── */}
      <Modal
        visible={reportVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setReportVisible(false)}
      >
        <View style={modal.overlay}>
          <View style={modal.sheet}>
            <View style={modal.handle} />
            <Text style={modal.title}>Report an Issue</Text>
            <Text style={modal.subtitle}>Select the issue you're experiencing:</Text>
            {REPORT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => handleReport(opt)}
                style={modal.optionRow}
                accessibilityRole="button"
                accessibilityLabel={opt}
              >
                <View style={modal.optionDot} />
                <Text style={modal.optionText}>{opt}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setReportVisible(false)} style={modal.cancelBtn}>
              <Text style={modal.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const modal = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.40)',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 14,
    paddingBottom: 36,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: 8,
  },
  title: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { fontSize: 13, color: Colors.textSecondary },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  optionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  optionText: { fontSize: 15, color: Colors.textPrimary, fontWeight: '500' },
  cancelBtn: {
    marginTop: 4,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  cancelText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, gap: 14, paddingBottom: 32 },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 14 },

  // Timeline
  timeline: { gap: 0 },
  stageRow: { flexDirection: 'row', alignItems: 'stretch', minHeight: 52 },
  stageLeft: { width: 32, alignItems: 'center', position: 'relative' },
  connector: {
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: -1,
    width: 2,
    height: 14,
    backgroundColor: Colors.border,
    zIndex: 0,
  },
  connectorBottom: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -1,
    width: 2,
    flex: 1,
    height: 14,
    backgroundColor: Colors.border,
    zIndex: 0,
  },
  connectorActive: { backgroundColor: Colors.primaryDark },
  stageLabelBox: { flex: 1, paddingLeft: 12, justifyContent: 'center', paddingVertical: 12 },
  stageLabel: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  stageLabelActive: { color: Colors.textPrimary, fontWeight: '700' },
  stageSub: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  stageSubCompleted: { color: Colors.primary },
  stageSubCurrent: { color: Colors.primaryDark, fontWeight: '600' },

  // Current status
  statusCard: {
    backgroundColor: Colors.primaryWash,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  statusIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusInfo: { flex: 1 },
  statusTitle: { fontSize: 14, fontWeight: '700', color: Colors.primaryDark },
  statusDesc: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },

  // Update box
  updateBox: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    minHeight: 72,
  },
  updateText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19 },
  charCount: { fontSize: 11, color: Colors.textMuted, textAlign: 'right', marginTop: 6 },

  // Buttons
  markBtn: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  markBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
  reportBtn: {
    borderRadius: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FFF5F5',
  },
  reportBtnText: { fontSize: 14, fontWeight: '600', color: Colors.danger },
});
