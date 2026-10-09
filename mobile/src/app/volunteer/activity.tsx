import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import VolunteerBottomNav from '@/components/volunteer/VolunteerBottomNav';
import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';
import Card from '@/components/ui/Card';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { Colors } from '@/constants/colors';
import { useVolunteerAssignments } from '@/store/volunteerAssignments.store';
import { formatDateTime } from '@/utils/dateTime';
import { getDonationStatusLabel } from '@/utils/donation';

export default function ActivityScreen() {
  const { assignments, selectAssignment, isLoading, error, refresh } = useVolunteerAssignments();
  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));
  const activity = assignments.flatMap((item) => item.statusLogs
    .filter((log) => ['assigned', 'pickup', 'arrived', 'collected', 'delivered'].includes(log.status))
    .map((log) => ({
    id: item.id + '-' + log.id, assignmentId: item.id, donorName: item.donorName,
    foodType: item.foodType, note: log.note, status: log.status, createdAt: log.createdAt,
  }))).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  return <SafeAreaView style={styles.safe} edges={['top']}>
    <VolunteerScreenHeader title="Activity" onBack={() => router.replace('/volunteer/dashboard')} />
    <View style={styles.screen}>
      <Card style={styles.summary}>
        <Text style={styles.title}>Pickup Activity</Text>
        <Text style={styles.count}>{activity.length} Updates</Text>
      </Card>
      <ScrollView contentContainerStyle={styles.content}>
        {isLoading && assignments.length === 0 ? <ActivityIndicator color={Colors.primary} /> : null}
        {error ? <Card style={styles.card}><Text accessibilityRole="alert" style={styles.error}>{error}</Text>
          <SecondaryButton title="Retry" onPress={() => void refresh()} /></Card> : null}
        {!isLoading && activity.length === 0 ? <Card><Text style={styles.body}>Your pickup activity will appear here after an NGO assigns you a donation.</Text></Card> : null}
        {activity.map((item) => <Pressable key={item.id} onPress={() => {
          selectAssignment(item.assignmentId);
          router.push('/volunteer/pickup-details');
        }}><Card style={styles.card}>
          <Text style={styles.title}>{getDonationStatusLabel(item.status)}</Text>
          <Text style={styles.body}>{item.foodType} · {item.donorName}</Text>
          {item.note ? <Text style={styles.body}>{item.note}</Text> : null}
          <Text style={styles.time}>{formatDateTime(item.createdAt)}</Text>
        </Card></Pressable>)}
      </ScrollView>
    </View>
    <VolunteerBottomNav activeTab="Activity" onPress={(route) => router.push(route as any)} />
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  screen: { flex: 1, padding: 16, gap: 16 },
  summary: { alignItems: 'center', gap: 5 },
  count: { color: Colors.primaryDark, fontWeight: '700' },
  content: { gap: 12, paddingBottom: 28 },
  card: { gap: 6 },
  title: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  body: { fontSize: 13, lineHeight: 20, color: Colors.textSecondary },
  time: { fontSize: 11, color: Colors.textMuted },
  error: { color: Colors.danger },
});
