import { useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { isAxiosError } from 'axios';
import type { NgoDonation } from '@/services/ngoDonations';
import { cancelNgoAssignment, updateNgoAssignmentDeadline } from '@/services/ngoDonations';
import { useNgoDonations } from '@/store/ngoDonations.store';
import PickupDeadlineField from '@/components/restaurant/PickupDeadlineField';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { C } from '@/components/ngo/NgoDesign';
import { formatDateTime } from '@/utils/dateTime';

export default function PendingAssignmentControls({ donation }: { donation: NgoDonation }) {
  const [deadline, setDeadline] = useState(donation.volunteerAcceptanceDeadline ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [confirmCancel, setConfirmCancel] = useState(false);
  const { loadDonation, refresh } = useNgoDonations();
  const pending = donation.status === 'assigned' && !donation.volunteerAcceptedAt;
  const mutate = async (cancel: boolean) => {
    if (saving) return;
    if (!cancel && (!deadline || Date.parse(deadline) <= Date.now() || Date.parse(deadline) > Date.parse(donation.pickupDeadline))) {
      setError('Choose a future accept-before time no later than the pickup deadline.'); return;
    }
    setSaving(true); setError('');
    try {
      if (cancel) await cancelNgoAssignment(donation.id);
      else await updateNgoAssignmentDeadline(donation.id, deadline);
      setConfirmCancel(false);
      await loadDonation(donation.id);
      await refresh();
    } catch (caught) {
      setConfirmCancel(false);
      setError(isAxiosError(caught) ? caught.response?.data?.message ?? 'Could not update the assignment.' : 'Could not update the assignment.');
      void loadDonation(donation.id).catch(() => undefined);
    } finally { setSaving(false); }
  };
  if (!donation.volunteerName) return null;
  return <View style={styles.card}>
    <Text style={styles.title}>{donation.volunteerAcceptedAt ? 'Volunteer accepted' : pending ? 'Awaiting volunteer acceptance' : 'Volunteer collection'}</Text>
    {donation.volunteerAcceptedAt ? <Text style={styles.text}>Accepted {formatDateTime(donation.volunteerAcceptedAt)}</Text> : null}
    {pending ? <>
      <PickupDeadlineField label="Volunteer must accept before" value={deadline} onChange={setDeadline} />
      <Text style={styles.text}>Pickup deadline: {formatDateTime(donation.pickupDeadline)}</Text>
      <PrimaryButton title="Save Acceptance Deadline" loading={saving} onPress={() => void mutate(false)} />
      <SecondaryButton title="Cancel Assignment" disabled={saving} onPress={() => setConfirmCancel(true)} />
      <Text style={styles.text}>Cancellation keeps the donation with your NGO for reassignment.</Text>
    </> : null}
    {error ? <Text accessibilityRole="alert" style={{ color: C.red }}>{error}</Text> : null}
    <Modal visible={confirmCancel} transparent animationType="fade" onRequestClose={() => { if (!saving) setConfirmCancel(false); }}>
      <View style={styles.overlay}><View style={styles.dialog}><Text style={styles.title}>Cancel volunteer assignment?</Text><Text style={styles.text}>The donation will be kept. The volunteer will no longer be assigned, and you can select another volunteer.</Text><PrimaryButton title="Cancel Assignment" loading={saving} onPress={() => void mutate(true)} /><SecondaryButton title="Keep Assignment" disabled={saving} onPress={() => setConfirmCancel(false)} /></View></View>
    </Modal>
  </View>;
}
const styles = StyleSheet.create({
  card: { margin: 20, padding: 18, backgroundColor: C.card, borderRadius: 18, gap: 12 },
  title: { color: C.text, fontSize: 16, fontWeight: '800' },
  text: { color: C.muted, fontSize: 13, lineHeight: 19 },
  overlay: { flex: 1, backgroundColor: 'rgba(11,30,22,0.55)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  dialog: { width: '100%', maxWidth: 360, backgroundColor: C.card, padding: 24, borderRadius: 18, gap: 16 },
});
