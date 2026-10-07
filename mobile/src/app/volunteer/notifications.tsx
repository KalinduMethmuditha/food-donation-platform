import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import type { IconName } from '@/components/ui/Icon';
import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';
import { useVolunteerStore } from '@/store/volunteerStore';


// Map any notification type string to a valid icon
function notifIcon(type: string): IconName {
  switch (type) {
    case 'pickup': return 'package';
    case 'reminder': return 'clock';
    case 'route': return 'route';
    case 'collection': return 'check-circle';
    case 'update': return 'message';
    case 'issue': return 'alert-triangle';
    case 'system': return 'bell';
    default: return 'bell';
  }
}

// Map navigateTo route to a friendly action name
function notifAction(navigateTo: string): string {
  if (navigateTo.includes('route')) return 'View Route';
  if (navigateTo.includes('collection-status')) return 'View Status';
  if (navigateTo.includes('confirmation')) return 'View Confirmation';
  if (navigateTo.includes('pickup-details')) return 'View Pickup';
  if (navigateTo.includes('activity')) return 'View Activity';
  return 'View';
}

export default function NotificationsScreen() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useVolunteerStore();
  const [tab, setTab] = useState<'all' | 'unread'>('all');

  const handleNotifPress = (id: string, navigateTo: string) => {
    markNotificationRead(id);
    router.push(navigateTo as any);
  };

  const visible = tab === 'all' ? notifications : notifications.filter((n) => !n.read);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <VolunteerScreenHeader
        title="Notifications"
        onBack={() => router.back()}
        rightLabel="Mark all read"
        onRightPress={markAllNotificationsRead}
      />

      {/* ─── TABS ─── */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          onPress={() => setTab('all')}
          style={[styles.tabItem, tab === 'all' && styles.tabItemActive]}
        >
          <Text style={[styles.tabLabel, tab === 'all' && styles.tabLabelActive]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTab('unread')}
          style={[styles.tabItem, tab === 'unread' && styles.tabItemActive]}
        >
          <Text style={[styles.tabLabel, tab === 'unread' && styles.tabLabelActive]}>
            Unread {unreadCount > 0 ? `(${unreadCount})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {visible.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="bell" size={40} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No {tab === 'unread' ? 'unread ' : ''}notifications</Text>
          </View>
        ) : (
          visible.map((notif) => (
            <TouchableOpacity
              key={notif.id}
              onPress={() => handleNotifPress(notif.id, notif.navigateTo)}
              style={[styles.notifCard, !notif.read && styles.notifCardUnread]}
              activeOpacity={0.75}
            >
              <View style={[styles.notifIconBox, !notif.read && styles.notifIconBoxUnread]}>
                <Icon name={notifIcon(notif.type)} size={18} color={Colors.primaryDark} />
              </View>
              <View style={styles.notifBody}>
                <View style={styles.notifTitleRow}>
                  <Text style={styles.notifTitle} numberOfLines={1}>{notif.title}</Text>
                  {!notif.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notifDesc} numberOfLines={2}>{notif.description}</Text>
                <View style={styles.notifFooter}>
                  <Text style={styles.notifTime}>{notif.time}</Text>
                  <Text style={styles.notifLink}>{notifAction(notif.navigateTo)} →</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, gap: 10, paddingBottom: 32 },
  tabBar: {
    flexDirection: 'row', backgroundColor: Colors.surface,
    borderBottomWidth: 1, borderBottomColor: Colors.border, paddingHorizontal: 16,
  },
  tabItem: { paddingVertical: 12, paddingHorizontal: 20, borderBottomWidth: 2.5, borderBottomColor: 'transparent' },
  tabItemActive: { borderBottomColor: Colors.primaryDark },
  tabLabel: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  tabLabelActive: { color: Colors.primaryDark },
  notifCard: {
    backgroundColor: Colors.surface, borderRadius: 14, borderWidth: 1, borderColor: Colors.border,
    padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 12,
  },
  notifCardUnread: { backgroundColor: Colors.primaryWash, borderColor: Colors.primaryLight },
  notifIconBox: {
    width: 40, height: 40, borderRadius: 11, backgroundColor: Colors.background,
    borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center',
  },
  notifIconBoxUnread: { backgroundColor: Colors.primaryLight, borderColor: Colors.primaryLight },
  notifBody: { flex: 1, gap: 3 },
  notifTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  notifTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primaryDark },
  notifDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  notifFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  notifTime: { fontSize: 11, color: Colors.textMuted },
  notifLink: { fontSize: 11, fontWeight: '700', color: Colors.primaryDark },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, color: Colors.textMuted, fontWeight: '500' },
});
