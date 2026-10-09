import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { Colors } from '@/constants/colors';
import { useSelectedAssignment, useVolunteerAssignments } from '@/store/volunteerAssignments.store';
import { useVolunteerStore } from '@/store/volunteerStore';
import { formatDateTime } from '@/utils/dateTime';

export default function ConfirmationScreen() {
  const assignment = useSelectedAssignment();
  const { advance, isSaving, error } = useVolunteerAssignments();
  const profile = useVolunteerStore((state) => state.profile);
  const collectedAt = assignment?.statusLogs.find((log) => log.status === 'collected')?.createdAt;
  const deliveredAt = assignment?.statusLogs.find((log) => log.status === 'delivered')?.createdAt;
  const complete = assignment?.status === 'collected' || assignment?.status === 'delivered';

  const markDelivered = async () => {
    if (!assignment || assignment.status !== 'collected') return;
    try {
      await advance(assignment.id, 'delivered');
    } catch {
      // The store displays the API error below.
    }
  };

  return <SafeAreaView style={styles.safe} edges={['top']}>
    <VolunteerScreenHeader title="Pickup Confirmation" onBack={() => router.back()} />
    <ScrollView contentContainerStyle={styles.content}>
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      {!assignment || !complete ? <Card style={styles.card}>
        <Text style={styles.title}>Confirmation not available</Text>
        <Text style={styles.body}>Record the collection before viewing its confirmation.</Text>
        <SecondaryButton title="View Pickups" onPress={() => router.replace('/volunteer/pickup-details')} />
      </Card> : <>
        <View style={styles.hero}><Icon name="check-circle" size={64} />
          <Text style={styles.title}>{deliveredAt ? 'Delivery Completed' : 'Food Collected'}</Text>
          <Text style={styles.body}>{deliveredAt ? 'The NGO and donor can now see the delivery.' : 'Confirm delivery when the food reaches its destination.'}</Text></View>
        <Card style={styles.card}>
          <Text style={styles.label}>PICKUP CONFIRMATION</Text>
          <Text style={styles.body}>Reference: DN-{assignment.id}</Text>
          <Text style={styles.body}>Donor: {assignment.donorName}</Text>
          <Text style={styles.body}>Food: {assignment.foodType}</Text>
          <Text style={styles.body}>Quantity: {assignment.quantity} {assignment.unit}</Text>
          <Text style={styles.body}>Volunteer: {profile.fullName}</Text>
          <Text style={styles.body}>Collected: {formatDateTime(collectedAt)}</Text>
          {deliveredAt ? <Text style={styles.body}>Delivered: {formatDateTime(deliveredAt)}</Text> : null}
          <Text style={styles.body}>Partner NGO: {assignment.ngoName || 'Unavailable'}</Text>
        </Card>
        {assignment.status === 'collected' ? (
          <PrimaryButton title="Mark as Delivered" loading={isSaving} disabled={isSaving} onPress={() => { void markDelivered(); }} />
        ) : null}
        <PrimaryButton title="Back to Dashboard" onPress={() => router.replace('/volunteer/dashboard')} />
        <SecondaryButton title="View Activity" onPress={() => router.push('/volunteer/activity')} />
      </>}
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, gap: 16, paddingBottom: 30 },
  hero: { alignItems: 'center', paddingVertical: 28, gap: 12 },
  card: { gap: 12 },
  title: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
  label: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary },
  body: { fontSize: 14, lineHeight: 21, color: Colors.textSecondary },
  error: { color: Colors.danger, fontSize: 13 },
});
