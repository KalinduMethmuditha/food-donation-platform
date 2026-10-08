import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { Colors } from '@/constants/colors';
import { useVolunteerAssignments } from '@/store/volunteerAssignments.store';
import { formatDateTime } from '@/utils/dateTime';
import { getDonationStatusLabel } from '@/utils/donation';

export default function NotificationsScreen() {
  const { assignments, selectAssignment, isLoading, error, refresh, readNotificationIds, markRead } = useVolunteerAssignments();
  const [tab, setTab] = useState<'all' | 'unread'>('all');
  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));
  const notifications = assignments.flatMap((item) => item.statusLogs
    .filter((log) => ['assigned', 'pickup', 'arrived', 'collected', 'delivered'].includes(log.status))
    .map((log) => ({
    id: item.id + '-' + log.id, logId: Number(log.id), assignmentId: item.id,
    title: getDonationStatusLabel(log.status), description: log.note || item.foodType,
    createdAt: log.createdAt,
  }))).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  const visible = tab === 'unread' ? notifications.filter((item) => !readNotificationIds.includes(item.logId)) : notifications;
  const unreadCount = notifications.filter((item) => !readNotificationIds.includes(item.logId)).length;

  return <SafeAreaView style={styles.safe} edges={['top']}>
    <VolunteerScreenHeader title="Notifications" onBack={() => router.back()}
      rightLabel="Mark all read" onRightPress={() => {
        if (notifications.length > 0) void markRead(notifications.map((item) => item.logId));
      }} />
    <View style={styles.tabs}>
      <Pressable onPress={() => setTab('all')} style={[styles.tab, tab === 'all' && styles.activeTab]}>
        <Text style={styles.tabText}>All</Text></Pressable>
      <Pressable onPress={() => setTab('unread')} style={[styles.tab, tab === 'unread' && styles.activeTab]}>
        <Text style={styles.tabText}>Unread ({unreadCount})</Text></Pressable>
    </View>
    <ScrollView contentContainerStyle={styles.content}>
      {isLoading && assignments.length === 0 ? <ActivityIndicator color={Colors.primary} /> : null}
      {error ? <Card style={styles.card}><Text accessibilityRole="alert" style={styles.error}>{error}</Text>
        <SecondaryButton title="Retry" onPress={() => void refresh()} /></Card> : null}
      {!isLoading && visible.length === 0 ? <Card><Text style={styles.body}>No {tab === 'unread' ? 'unread ' : ''}pickup updates yet.</Text></Card> : null}
      {visible.map((item) => <Pressable key={item.id} onPress={() => {
        void markRead([item.logId]);
        selectAssignment(item.assignmentId);
        router.push('/volunteer/pickup-details');
      }}><Card style={[styles.card, !readNotificationIds.includes(item.logId) && styles.unread]}>
        <View style={styles.row}><Icon name="bell" size={18} />
          <Text style={styles.title}>{item.title}</Text></View>
        <Text style={styles.body}>{item.description}</Text>
        <Text style={styles.time}>{formatDateTime(item.createdAt)}</Text>
      </Card></Pressable>)}
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  tabs: { flexDirection: 'row', backgroundColor: Colors.surface },
  tab: { flex: 1, padding: 14, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: Colors.primary },
  tabText: { color: Colors.textPrimary, fontWeight: '600' },
  content: { padding: 16, gap: 12, paddingBottom: 28 },
  card: { gap: 7 },
  unread: { borderColor: Colors.primary },
  row: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  title: { color: Colors.textPrimary, fontWeight: '700', fontSize: 14 },
  body: { color: Colors.textSecondary, fontSize: 13 },
  time: { color: Colors.textMuted, fontSize: 11 },
  error: { color: Colors.danger },
});
