import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import VolunteerBottomNav from '@/components/volunteer/VolunteerBottomNav';
import VolunteerQuickAction from '@/components/volunteer/VolunteerQuickAction';
import Card from '@/components/ui/Card';
import AppHeader from '@/components/shared/AppHeader';
import DashboardHero from '@/components/shared/DashboardHero';
import StatCard from '@/components/shared/StatCard';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { Colors } from '@/constants/colors';
import { useVolunteerAssignments } from '@/store/volunteerAssignments.store';
import { useVolunteerStore } from '@/store/volunteerStore';
import { formatDateTime } from '@/utils/dateTime';
import { getDonationStatusLabel } from '@/utils/donation';

export default function VolunteerDashboard() {
  const { profile } = useVolunteerStore();
  const { assignments, selectAssignment, isAvailable, isLoading, isSaving, error, refresh, setAvailability } = useVolunteerAssignments();
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));
  const changeAvailability = (value: boolean) => {
    setAvailabilityError(null);
    void setAvailability(value).catch(() => {
      setAvailabilityError(useVolunteerAssignments.getState().error ?? 'Could not update availability.');
    });
  };
  const active = assignments.filter((item) => !['collected', 'delivered', 'cancelled'].includes(item.status));
  const latestLogs = assignments.flatMap((item) => item.statusLogs
    .filter((log) => ['assigned', 'pickup', 'arrived', 'collected', 'delivered'].includes(log.status))
    .map((log) => ({
    id: log.id, donationId: item.id, donorName: item.donorName, note: log.note,
    status: log.status, createdAt: log.createdAt,
  }))).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 3);
  const open = (id: string) => {
    selectAssignment(id);
    router.push('/volunteer/pickup-details');
  };

  return <SafeAreaView style={styles.safe} edges={['top']}>
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <DashboardHero header={<AppHeader title="Serve With Purpose" variant="hero"
          onMenuPress={() => router.push('/volunteer/profile')}
          onNotificationPress={() => router.push('/volunteer/notifications')} />}
          greeting={`Hi ${profile.fullName.split(' ')[0] || 'Volunteer'}!`}
          subtitle="Here are your assigned collections" emoji="🚚" />
        <View style={styles.main}>
        <Card style={styles.summary}>
          <Text style={styles.summaryLabel}>YOUR PICKUPS</Text>
          <Text style={styles.summaryCount}>{active.length} Active</Text>
          <Text style={styles.summaryText}>{assignments.length} total assigned donations</Text>
          <PrimaryButton title="View Assigned Pickups" onPress={() => router.push('/volunteer/pickup-details')} />
        </Card>
        <View style={styles.stats}>
          <StatCard value={active.length} label="Active" />
          <StatCard value={assignments.filter((item) => item.status === 'delivered').length} label="Delivered" />
          <StatCard value={assignments.length} label="Total" />
        </View>
        <Card style={styles.availabilityCard}>
          <View style={styles.availabilityRow}>
            <View style={styles.availabilityCopy}>
              <Text style={styles.cardTitle}>Available for pickups</Text>
              <Text style={styles.sub}>{isAvailable ? 'NGOs can find and assign you.' : 'Turn this on to appear in the NGO volunteer list.'}</Text>
            </View>
            <Switch
              value={isAvailable}
              onValueChange={changeAvailability}
              disabled={isLoading || isSaving}
              accessibilityLabel="Available for pickups"
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
          {availabilityError ? <Text accessibilityRole="alert" style={styles.error}>{availabilityError}</Text> : null}
        </Card>
        {isLoading && assignments.length === 0 ? <ActivityIndicator color={Colors.primary} /> : null}
        {error ? <Card style={styles.gap}><Text accessibilityRole="alert" style={styles.error}>{error}</Text>
          <SecondaryButton title="Try Again" onPress={() => void refresh()} /></Card> : null}
        <Text style={styles.section}>Assigned Pickups</Text>
        {!isLoading && assignments.length === 0 ? <Card><Text style={styles.sub}>No pickups have been assigned yet.</Text></Card> : null}
        {assignments.map((item) => <Pressable key={item.id} onPress={() => open(item.id)}>
          <Card style={styles.gap}>
            <View style={styles.row}><Text style={styles.cardTitle}>{item.donorName}</Text>
              <Text style={styles.status}>{getDonationStatusLabel(item.status)}</Text></View>
            <Text style={styles.body}>{item.foodType} · {item.quantity} {item.unit}</Text>
            <Text style={styles.body}>Pickup before {formatDateTime(item.pickupDeadline)}</Text>
            <Text style={styles.body}>{item.pickupLocation}</Text>
            <Text style={styles.link}>View pickup →</Text>
          </Card>
        </Pressable>)}
        <Text style={styles.section}>Quick Actions</Text>
        <View style={styles.actions}>
          <VolunteerQuickAction title="Pickups" icon="truck" onPress={() => router.push('/volunteer/pickup-details')} />
          <VolunteerQuickAction title="Activity" icon="activity" onPress={() => router.push('/volunteer/activity')} />
          <VolunteerQuickAction title="Notifications" icon="bell" onPress={() => router.push('/volunteer/notifications')} />
        </View>
        {latestLogs.length > 0 ? <>
          <Text style={styles.section}>Recent Updates</Text>
          {latestLogs.map((log) => <Pressable key={log.id} onPress={() => open(log.donationId)}>
            <Card style={styles.gap}>
              <Text style={styles.cardTitle}>{getDonationStatusLabel(log.status)}</Text>
              <Text style={styles.body}>{log.donorName} · {log.note || 'Status updated'}</Text>
              <Text style={styles.body}>{formatDateTime(log.createdAt)}</Text>
            </Card>
          </Pressable>)}
        </> : null}
        </View>
      </ScrollView>
      <VolunteerBottomNav activeTab="Home" onPress={(route) => router.push(route as any)} />
    </View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  screen: { flex: 1 },
  content: { paddingBottom: 32 },
  main: { marginTop: -36, paddingHorizontal: 16, gap: 12 },
  stats: { flexDirection: 'row', gap: 10, marginVertical: 4 },
  sub: { fontSize: 13, lineHeight: 20, color: Colors.textSecondary, marginTop: 4 },
  summary: { gap: 8 },
  summaryLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: '700' },
  summaryCount: { fontSize: 22, color: Colors.textPrimary, fontWeight: '800' },
  summaryText: { fontSize: 13, color: Colors.textSecondary },
  availabilityCard: { gap: 8 },
  availabilityRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  availabilityCopy: { flex: 1 },
  section: { fontSize: 17, fontWeight: '800', color: Colors.textPrimary, marginTop: 12 },
  gap: { gap: 7 },
  error: { color: Colors.danger },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  cardTitle: { flex: 1, fontSize: 15, fontWeight: '800', color: Colors.textPrimary },
  status: { fontSize: 11, fontWeight: '700', color: Colors.primaryDark },
  body: { color: Colors.textSecondary, fontSize: 13, lineHeight: 19 },
  link: { color: Colors.primaryDark, fontWeight: '700', fontSize: 13, marginTop: 5 },
  actions: { flexDirection: 'row', paddingVertical: 8 },
});
