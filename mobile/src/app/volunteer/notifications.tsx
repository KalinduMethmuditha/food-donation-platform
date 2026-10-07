import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import { mockNotifications, type AppNotification } from '@/data/mockVolunteerData';
import type { IconName } from '@/components/ui/Icon';
import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';

function notifIcon(type: AppNotification['type']): IconName {
  switch (type) {
    case 'pickup': return 'package';
    case 'reminder': return 'clock';
    case 'route': return 'route';
    case 'collection': return 'check-circle';
  }
}

function NotificationCard({
  notif,
  onPress,
}: {
  notif: AppNotification;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.notifCard, !notif.read && styles.notifCardUnread]}
      accessibilityRole="button"
      accessibilityLabel={notif.title}
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
        <Text style={styles.notifTime}>{notif.time}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [tab, setTab] = useState<'all' | 'unread'>('all');

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotifPress = (notif: AppNotification) => {
    // Mark this notification as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    // Navigate to the linked screen
    router.push(notif.navigateTo as any);
  };

  const visible = tab === 'all' ? notifications : notifications.filter((n) => !n.read);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <VolunteerScreenHeader
        title="Notifications"
        onBack={() => router.back()}
        rightLabel="Mark all as read"
        onRightPress={markAllRead}
      />

      {/* ─── TABS ─── */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          onPress={() => setTab('all')}
          style={[styles.tabItem, tab === 'all' && styles.tabItemActive]}
          accessibilityRole="tab"
          accessibilityState={{ selected: tab === 'all' }}
        >
          <Text style={[styles.tabLabel, tab === 'all' && styles.tabLabelActive]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTab('unread')}
          style={[styles.tabItem, tab === 'unread' && styles.tabItemActive]}
          accessibilityRole="tab"
          accessibilityState={{ selected: tab === 'unread' }}
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
            <NotificationCard
              key={notif.id}
              notif={notif}
              onPress={() => handleNotifPress(notif)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, gap: 10, paddingBottom: 32 },

  // Tabs
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: 16,
  },
  tabItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 2.5,
    borderBottomColor: 'transparent',
  },
  tabItemActive: { borderBottomColor: Colors.primaryDark },
  tabLabel: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  tabLabelActive: { color: Colors.primaryDark },

  // Notification card
  notifCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  notifCardUnread: {
    backgroundColor: Colors.primaryWash,
    borderColor: Colors.primaryLight,
  },
  notifIconBox: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifIconBoxUnread: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primaryLight,
  },
  notifBody: { flex: 1, gap: 3 },
  notifTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  notifTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, flex: 1 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primaryDark,
  },
  notifDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  notifTime: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyText: { fontSize: 15, color: Colors.textMuted, fontWeight: '500' },
});
