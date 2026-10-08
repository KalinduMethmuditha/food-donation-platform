import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import VolunteerBottomNav from '@/components/volunteer/VolunteerBottomNav';
import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { Colors } from '@/constants/colors';
import { useSelectedAssignment, useVolunteerAssignments } from '@/store/volunteerAssignments.store';
import { formatDateTime } from '@/utils/dateTime';
import { getDonationStatusLabel } from '@/utils/donation';

export default function PickupDetailsScreen() {
  const assignment = useSelectedAssignment();
  const { advance, isLoading, isSaving, error, refresh } = useVolunteerAssignments();

  const startRoute = async () => {
    if (!assignment) return;
    if (assignment.status === 'assigned') {
      try { await advance(assignment.id, 'pickup'); } catch { return; }
    }
    router.push('/volunteer/route');
  };

  return <SafeAreaView style={styles.safe} edges={['top']}>
    <VolunteerScreenHeader title="Pickup Details" onBack={() => router.replace('/volunteer/dashboard')} />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      {!assignment ? <Card style={styles.card}>
        <Text style={styles.title}>{isLoading ? 'Loading pickups...' : 'No pickup selected'}</Text>
        <Text style={styles.body}>Assigned donations will appear here after an NGO selects you.</Text>
        <SecondaryButton title="Refresh" onPress={() => void refresh()} />
      </Card> : <>
        <Card style={styles.card}>
          <View style={styles.row}><Icon name={assignment.donorRole === 'household' ? 'home' : 'building'} size={28} />
            <View style={styles.copy}><Text style={styles.title}>{assignment.donorName}</Text>
              <Text style={styles.body}>{assignment.donorRole === 'household' ? 'Household donor' : 'Restaurant donor'}</Text></View></View>
          <View style={styles.row}><Icon name="pin" size={15} />
            <Text style={styles.body}>{assignment.pickupLocation}</Text></View>
        </Card>
        <Card style={styles.card}>
          <Text style={styles.title}>Pickup Information</Text>
          <Text style={styles.label}>Food</Text><Text style={styles.value}>{assignment.foodType}</Text>
          <Text style={styles.label}>Quantity</Text><Text style={styles.value}>{assignment.quantity} {assignment.unit}</Text>
          <Text style={styles.label}>Pickup deadline</Text><Text style={styles.value}>{formatDateTime(assignment.pickupDeadline)}</Text>
          <Text style={styles.label}>Status</Text><Text style={styles.value}>{getDonationStatusLabel(assignment.status)}</Text>
          <Text style={styles.label}>Partner NGO</Text><Text style={styles.value}>{assignment.ngoName || 'Not available'}</Text>
        </Card>
        {assignment.description ? <Card style={styles.card}>
          <Text style={styles.title}>Special Notes</Text><Text style={styles.body}>{assignment.description}</Text>
        </Card> : null}
        {assignment.status === 'assigned' || assignment.status === 'pickup' ? (
          <PrimaryButton title={assignment.status === 'assigned' ? 'Start Route' : 'View Route'}
            loading={isSaving} onPress={() => void startRoute()} />
        ) : assignment.status === 'arrived' ? (
          <PrimaryButton title="Update Collection" onPress={() => router.push('/volunteer/collection-status')} />
        ) : (
          <PrimaryButton title="View Confirmation" onPress={() => router.push('/volunteer/confirmation')} />
        )}
      </>}
    </ScrollView>
    <VolunteerBottomNav activeTab="Pickups" onPress={(route) => router.push(route as any)} />
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, gap: 14, paddingBottom: 30 },
  card: { gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  copy: { flex: 1 },
  title: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  body: { fontSize: 13, lineHeight: 20, color: Colors.textSecondary },
  label: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary, marginTop: 10 },
  value: { fontSize: 14, color: Colors.textPrimary },
  error: { color: Colors.danger, fontSize: 13 },
});
