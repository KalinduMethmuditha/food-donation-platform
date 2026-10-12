import { useState } from 'react';
import { router } from 'expo-router';
import { Modal, StyleSheet, Text, View } from 'react-native';
import Card from '@/components/ui/Card';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { Colors } from '@/constants/colors';
import type { CorrectionStatus, VolunteerAssignment } from '@/services/volunteerAssignments';
import { useVolunteerAssignments } from '@/store/volunteerAssignments.store';

const stages = [
  { status: 'assigned', label: 'Assigned' },
  { status: 'pickup', label: 'On the Way' },
  { status: 'arrived', label: 'Arrived' },
  { status: 'collected', label: 'Collected' },
  { status: 'delivered', label: 'Delivered' },
] as const;

export default function AssignmentControls({ assignment }: { assignment: VolunteerAssignment }) {
  const { cancel, correct, isSaving } = useVolunteerAssignments();
  const [action, setAction] = useState<'cancel' | CorrectionStatus | null>(null);
  const currentIndex = stages.findIndex((stage) => stage.status === assignment.status);
  const accepted = !!assignment.volunteerAcceptedAt || !assignment.volunteerAcceptanceDeadline;
  if (!accepted || currentIndex < 0) return null;
  const target = stages.find((stage) => stage.status === action);
  const submit = async () => {
    if (!action || isSaving) return;
    try {
      if (action === 'cancel') {
        await cancel(assignment.id);
        setAction(null);
        router.replace('/volunteer/dashboard');
      } else {
        await correct(assignment.id, action);
        setAction(null);
      }
    } catch { setAction(null); /* The screen displays the store error. */ }
  };
  return <Card style={styles.card}>
    <Text style={styles.title}>Assignment Controls</Text>
    {currentIndex > 0 ? <>
      <Text style={styles.body}>Correct pickup progress by choosing an earlier step.</Text>
      {stages.slice(0, currentIndex).map((stage) => <SecondaryButton key={stage.status} title={`Move back to ${stage.label}`} disabled={isSaving} onPress={() => setAction(stage.status as CorrectionStatus)} />)}
    </> : null}
    {assignment.status !== 'delivered' ? <SecondaryButton title="Cancel Accepted Assignment" disabled={isSaving} onPress={() => setAction('cancel')} /> : null}
    <Modal visible={action !== null} transparent animationType="fade" onRequestClose={() => { if (!isSaving) setAction(null); }}>
      <View style={styles.overlay}><Card style={styles.dialog}>
        <Text style={styles.title}>{action === 'cancel' ? 'Cancel accepted assignment?' : `Move back to ${target?.label}?`}</Text>
        <Text style={styles.body}>{action === 'cancel' ? 'The donation stays with the NGO for reassignment and will be removed from your pickups.' : 'The NGO and donor will see the corrected status. This change is recorded in the donation history.'}</Text>
        <PrimaryButton title={action === 'cancel' ? 'Confirm Cancellation' : 'Confirm Correction'} loading={isSaving} onPress={() => void submit()} />
        <SecondaryButton title="Keep Current Status" disabled={isSaving} onPress={() => setAction(null)} />
      </Card></View>
    </Modal>
  </Card>;
}

const styles = StyleSheet.create({
  card: { gap: 12 },
  title: { color: Colors.textPrimary, fontSize: 17, fontWeight: '800' },
  body: { color: Colors.textSecondary, fontSize: 13, lineHeight: 20 },
  overlay: { flex: 1, backgroundColor: Colors.overlay, padding: 24, alignItems: 'center', justifyContent: 'center' },
  dialog: { width: '100%', maxWidth: 380, gap: 16 },
});
