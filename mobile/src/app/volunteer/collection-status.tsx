import { router } from 'expo-router';
<<<<<<< Updated upstream
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
=======
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
>>>>>>> Stashed changes
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import { mockActivePickup } from '@/data/mockVolunteerData';
import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';
<<<<<<< Updated upstream

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
=======
import { useVolunteerStore, type PickupStatus } from '@/store/volunteerStore';

const STAGES: { label: string; statusValue: PickupStatus }[] = [
  { label: 'Assigned', statusValue: 'ASSIGNED' },
  { label: 'On the Way', statusValue: 'ON THE WAY' },
  { label: 'Arrived', statusValue: 'ARRIVED' },
  { label: 'Collected', statusValue: 'COLLECTED' },
  { label: 'Delivered', statusValue: 'DELIVERED' },
];

const REPORT_OPTIONS = ['Damaged food', 'Donor unavailable', 'Quantity mismatch', 'Pickup delayed', 'Wrong address', 'Food quality concern', 'Vehicle/transport issue', 'Other'];

export default function CollectionStatusScreen() {
  const pickup = mockActivePickup;
  const { pickupStatus, setPickupStatus, addUpdate, reportIssue } = useVolunteerStore();
  
  const [reportVisible, setReportVisible] = useState(false);
  const [otherIssueVisible, setOtherIssueVisible] = useState(false);
  const [otherIssueTitle, setOtherIssueTitle] = useState('');
  const [otherIssueDesc, setOtherIssueDesc] = useState('');
  
  const [updateText, setUpdateText] = useState('');

  const currentStageIndex = STAGES.findIndex(s => s.statusValue === pickupStatus);

  const handleStagePress = (index: number) => {
    // Only allow sequential or backwards changes for safety, though clicking directly is requested.
    setPickupStatus(STAGES[index].statusValue);
  };

  const handleReport = (option: string) => {
    if (option === 'Other') {
      setReportVisible(false);
      setTimeout(() => setOtherIssueVisible(true), 300);
      return;
    }
    setReportVisible(false);
    reportIssue(option);
    Alert.alert('Issue Reported', `A ${option.toLowerCase()} issue was reported.`, [{ text: 'OK' }]);
  };

  const handleSubmitOtherIssue = () => {
    if (!otherIssueTitle.trim()) {
      Alert.alert('Required', 'Please enter an issue type.');
      return;
    }
    reportIssue(otherIssueTitle, otherIssueDesc);
    setOtherIssueVisible(false);
    setOtherIssueTitle('');
    setOtherIssueDesc('');
    Alert.alert('Issue Reported', 'Your issue has been recorded successfully.', [{ text: 'OK' }]);
  };

  const handleAddUpdate = () => {
    if (!updateText.trim()) return;
    addUpdate(updateText);
    setUpdateText('');
    Alert.alert('Update Added', 'Your update has been posted to activity.', [{ text: 'OK' }]);
  };

  const handleActionBtn = () => {
    if (pickupStatus === 'DELIVERED') {
      router.push('/volunteer/confirmation');
    } else if (pickupStatus === 'COLLECTED') {
      setPickupStatus('DELIVERED');
    } else {
      setPickupStatus('COLLECTED');
    }
  };

  const getStageStatus = (index: number) => {
    if (index < currentStageIndex) return 'completed';
    if (index === currentStageIndex) return 'current';
    return 'upcoming';
>>>>>>> Stashed changes
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <VolunteerScreenHeader title="Collection Status" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ─── COLLECTION PROGRESS ─── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Collection Progress</Text>
<<<<<<< Updated upstream

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
=======
          <Text style={styles.cardSub}>Tap a stage to update status manually</Text>

          <View style={styles.timeline}>
            {STAGES.map((stage, i) => {
              const statusType = getStageStatus(i);
              return (
                <TouchableOpacity 
                  key={stage.label} 
                  style={styles.stageRow}
                  onPress={() => handleStagePress(i)}
                  activeOpacity={0.7}
                >
                  <View style={styles.stageLeft}>
                    {i > 0 && (
                      <View style={[styles.connector, statusType !== 'upcoming' && getStageStatus(i - 1) !== 'upcoming' && styles.connectorActive]} />
                    )}
                    
                    {/* Circle Indicator */}
                    {statusType === 'completed' && (
                      <View style={[styles.circle, styles.completed]}>
                        <Icon name="check" size={13} color={Colors.white} />
                      </View>
                    )}
                    {statusType === 'current' && (
                      <View style={[styles.circle, styles.current]}>
                        <View style={styles.currentDot} />
                      </View>
                    )}
                    {statusType === 'upcoming' && (
                      <View style={[styles.circle, styles.upcoming]} />
                    )}
                    
                    {i < STAGES.length - 1 && (
                      <View style={[styles.connectorBottom, statusType !== 'upcoming' && styles.connectorActive]} />
                    )}
                  </View>
                  <View style={styles.stageLabelBox}>
                    <Text style={[styles.stageLabel, statusType === 'current' && styles.stageLabelActive]}>
                      {stage.label}
                    </Text>
                    <Text style={[
                      styles.stageSub,
                      statusType === 'completed' && styles.stageSubCompleted,
                      statusType === 'current' && styles.stageSubCurrent,
                    ]}>
                      {statusType === 'completed' ? 'Completed' : statusType === 'current' ? 'Current stage' : 'Upcoming'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
>>>>>>> Stashed changes
          </View>
        </View>

        {/* ─── CURRENT STATUS CARD ─── */}
        <View style={styles.statusCard}>
          <View style={styles.statusIconBox}>
<<<<<<< Updated upstream
            <Icon name="pin" size={20} color={Colors.primaryDark} />
          </View>
          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>Arrived at pickup location</Text>
            <Text style={styles.statusDesc}>You have reached {pickup.donor}.</Text>
=======
            <Icon name={pickupStatus === 'DELIVERED' ? 'check-circle' : 'pin'} size={20} color={Colors.primaryDark} />
          </View>
          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>
              {pickupStatus === 'DELIVERED' ? 'Delivery Completed' :
               pickupStatus === 'COLLECTED' ? 'Donation Collected' :
               pickupStatus === 'ARRIVED' ? 'Arrived at pickup location' :
               pickupStatus === 'ON THE WAY' ? 'Heading to pickup location' : 'Assigned to you'}
            </Text>
            <Text style={styles.statusDesc}>
              {pickupStatus === 'DELIVERED' ? 'The donation has been successfully delivered.' :
               pickupStatus === 'COLLECTED' ? 'You have the items securely.' :
               pickupStatus === 'ARRIVED' ? `You have reached ${pickup.donor}.` : 
               `Currently targeting ${pickup.donor}.`}
            </Text>
>>>>>>> Stashed changes
          </View>
        </View>

        {/* ─── ADD UPDATE ─── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Add Update</Text>
          <View style={styles.updateBox}>
<<<<<<< Updated upstream
            <Text style={styles.updateText}>
              Volunteer has reached the pickup point and is verifying the donation package.
            </Text>
            <Text style={styles.charCount}>93/150</Text>
          </View>
=======
            <TextInput
              style={styles.updateInput}
              placeholder="E.g., Verifying the donation package..."
              placeholderTextColor={Colors.textMuted}
              multiline
              value={updateText}
              onChangeText={setUpdateText}
              maxLength={150}
            />
            <Text style={styles.charCount}>{updateText.length}/150</Text>
          </View>
          <TouchableOpacity 
            style={[styles.postBtn, !updateText.trim() && { opacity: 0.5 }]} 
            onPress={handleAddUpdate}
            disabled={!updateText.trim()}
          >
            <Text style={styles.postBtnText}>Post Update</Text>
          </TouchableOpacity>
>>>>>>> Stashed changes
        </View>

        {/* ─── ACTIONS ─── */}
        <TouchableOpacity
<<<<<<< Updated upstream
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
=======
          onPress={handleActionBtn}
          style={styles.markBtn}
        >
          <Icon name="check-circle" size={19} color={Colors.white} />
          <Text style={styles.markBtnText}>
            {pickupStatus === 'DELIVERED' ? 'View Confirmation' :
             pickupStatus === 'COLLECTED' ? 'Mark as Delivered' : 'Mark as Collected'}
          </Text>
        </TouchableOpacity>

        {pickupStatus !== 'DELIVERED' && (
          <TouchableOpacity
            onPress={() => setReportVisible(true)}
            style={styles.reportBtn}
          >
            <Icon name="alert-triangle" size={17} color={Colors.danger} />
            <Text style={styles.reportBtnText}>Report Issue</Text>
          </TouchableOpacity>
        )}
>>>>>>> Stashed changes

      </ScrollView>

      {/* ─── REPORT ISSUE MODAL ─── */}
<<<<<<< Updated upstream
      <Modal
        visible={reportVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setReportVisible(false)}
      >
=======
      <Modal visible={reportVisible} transparent animationType="slide" onRequestClose={() => setReportVisible(false)}>
>>>>>>> Stashed changes
        <View style={modal.overlay}>
          <View style={modal.sheet}>
            <View style={modal.handle} />
            <Text style={modal.title}>Report an Issue</Text>
            <Text style={modal.subtitle}>Select the issue you're experiencing:</Text>
<<<<<<< Updated upstream
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
=======
            <ScrollView style={{maxHeight: 400}}>
              {REPORT_OPTIONS.map((opt) => (
                <TouchableOpacity key={opt} onPress={() => handleReport(opt)} style={modal.optionRow}>
                  <View style={modal.optionDot} />
                  <Text style={modal.optionText}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
>>>>>>> Stashed changes
            <TouchableOpacity onPress={() => setReportVisible(false)} style={modal.cancelBtn}>
              <Text style={modal.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
<<<<<<< Updated upstream
=======

      {/* ─── OTHER ISSUE MODAL ─── */}
      <Modal visible={otherIssueVisible} transparent animationType="fade" onRequestClose={() => setOtherIssueVisible(false)}>
        <View style={modal.overlay}>
          <View style={modal.formSheet}>
            <Text style={modal.title}>Other Issue</Text>
            <Text style={modal.label}>Issue Type</Text>
            <TextInput 
              style={modal.input} 
              placeholder="e.g. Packaging problem" 
              value={otherIssueTitle} 
              onChangeText={setOtherIssueTitle} 
            />
            <Text style={modal.label}>Description</Text>
            <TextInput 
              style={[modal.input, { height: 80, textAlignVertical: 'top' }]} 
              placeholder="Explain the issue..." 
              multiline 
              value={otherIssueDesc} 
              onChangeText={setOtherIssueDesc} 
            />
            <View style={modal.formActions}>
              <TouchableOpacity onPress={() => setOtherIssueVisible(false)} style={modal.formCancelBtn}>
                <Text style={modal.formCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmitOtherIssue} style={modal.formSubmitBtn}>
                <Text style={modal.formSubmitText}>Send Issue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
>>>>>>> Stashed changes
    </SafeAreaView>
  );
}

const modal = StyleSheet.create({
<<<<<<< Updated upstream
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
=======
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.40)' },
  sheet: { backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 14, paddingBottom: 36 },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: 'center', marginBottom: 8 },
  title: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { fontSize: 13, color: Colors.textSecondary },
  optionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: Colors.border },
  optionDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  optionText: { fontSize: 15, color: Colors.textPrimary, fontWeight: '500' },
  cancelBtn: { marginTop: 4, paddingVertical: 13, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  cancelText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  
  formSheet: { backgroundColor: Colors.surface, padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 40 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginTop: 16, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: Colors.border, borderRadius: 8, padding: 12, fontSize: 14, color: Colors.textPrimary, backgroundColor: Colors.background },
  formActions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  formCancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  formCancelText: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  formSubmitBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: Colors.danger, alignItems: 'center' },
  formSubmitText: { fontSize: 14, fontWeight: '700', color: Colors.white },
>>>>>>> Stashed changes
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, gap: 14, paddingBottom: 32 },

<<<<<<< Updated upstream
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 14 },
=======
  card: { backgroundColor: Colors.surface, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, padding: 16 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  cardSub: { fontSize: 12, color: Colors.textSecondary, marginBottom: 14 },
>>>>>>> Stashed changes

  // Timeline
  timeline: { gap: 0 },
  stageRow: { flexDirection: 'row', alignItems: 'stretch', minHeight: 52 },
  stageLeft: { width: 32, alignItems: 'center', position: 'relative' },
<<<<<<< Updated upstream
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
=======
  connector: { position: 'absolute', top: 0, left: '50%', marginLeft: -1, width: 2, height: 14, backgroundColor: Colors.border, zIndex: 0 },
  connectorBottom: { position: 'absolute', bottom: 0, left: '50%', marginLeft: -1, width: 2, flex: 1, height: 14, backgroundColor: Colors.border, zIndex: 0 },
  connectorActive: { backgroundColor: Colors.primaryDark },
  circle: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  completed: { backgroundColor: Colors.primaryDark },
  current: { backgroundColor: Colors.white, borderWidth: 2.5, borderColor: Colors.primaryDark },
  upcoming: { backgroundColor: Colors.white, borderWidth: 2, borderColor: Colors.border },
  currentDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primaryDark },
>>>>>>> Stashed changes
  stageLabelBox: { flex: 1, paddingLeft: 12, justifyContent: 'center', paddingVertical: 12 },
  stageLabel: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  stageLabelActive: { color: Colors.textPrimary, fontWeight: '700' },
  stageSub: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  stageSubCompleted: { color: Colors.primary },
  stageSubCurrent: { color: Colors.primaryDark, fontWeight: '600' },

  // Current status
<<<<<<< Updated upstream
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
=======
  statusCard: { backgroundColor: Colors.primaryWash, borderRadius: 14, borderWidth: 1, borderColor: Colors.primaryLight, padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  statusIconBox: { width: 38, height: 38, borderRadius: 10, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
>>>>>>> Stashed changes
  statusInfo: { flex: 1 },
  statusTitle: { fontSize: 14, fontWeight: '700', color: Colors.primaryDark },
  statusDesc: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },

  // Update box
<<<<<<< Updated upstream
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
=======
  updateBox: { backgroundColor: Colors.background, borderRadius: 10, borderWidth: 1, borderColor: Colors.border, padding: 12, minHeight: 80, marginBottom: 12 },
  updateInput: { fontSize: 13, color: Colors.textPrimary, flex: 1, textAlignVertical: 'top' },
  charCount: { fontSize: 11, color: Colors.textMuted, textAlign: 'right', marginTop: 6 },
  postBtn: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.primary, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  postBtnText: { color: Colors.primaryDark, fontSize: 13, fontWeight: '700' },

  // Buttons
  markBtn: { backgroundColor: Colors.primaryDark, borderRadius: 14, paddingVertical: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  markBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
  reportBtn: { borderRadius: 14, paddingVertical: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, borderWidth: 1, borderColor: '#FECACA', backgroundColor: '#FFF5F5' },
>>>>>>> Stashed changes
  reportBtnText: { fontSize: 14, fontWeight: '600', color: Colors.danger },
});
