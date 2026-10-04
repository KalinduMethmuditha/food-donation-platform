import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AppHeader from '@/components/restaurant/AppHeader';
import BottomNavigation from '@/components/restaurant/BottomNavigation';
import EmptyState from '@/components/shared/EmptyState';
import Screen from '@/components/shared/Screen';
import Card from '@/components/ui/Card';
import Icon, { type IconName } from '@/components/ui/Icon';
import SegmentedControl from '@/components/ui/SegmentedControl';
import { Colors } from '@/constants/colors';
import { mockNotifications } from '@/data/mockRestaurantData';
import type { NotificationItem } from '@/types/notification';

const notificationIcons: Record<NotificationItem['kind'], IconName> = {
  assigned: 'users', accepted: 'check', published: 'arrow-up', collected: 'gift',
};

export default function NotificationsScreen() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const unreadCount = mockNotifications.filter((item) => item.unread).length;
  const visibleNotifications = mockNotifications.filter((item) => filter === 'all' || item.unread);

  return <Screen>
    <AppHeader title="Notifications" />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <SegmentedControl options={[{ label: 'All', value: 'all' }, { label: 'Unread (' + unreadCount + ')', value: 'unread' }]}
        value={filter} onChange={setFilter} />
      <Text style={styles.sectionTitle}>{filter === 'all' ? 'RECENT UPDATES' : 'UNREAD UPDATES'}</Text>
      <View style={styles.list}>
        {visibleNotifications.map((notification) => <Card key={notification.id}
          style={[styles.notification, notification.unread && styles.unread]}>
          <View style={styles.icon}><Icon name={notificationIcons[notification.kind]} size={22} /></View>
          <View style={styles.notificationContent}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{notification.title}</Text>
              {notification.unread && <View accessibilityLabel="Unread" style={styles.unreadDot} />}
            </View>
            <Text style={styles.message}>{notification.message}</Text>
            <Text style={styles.time}>{notification.time}</Text>
          </View>
        </Card>)}
      </View>
      {visibleNotifications.length === 0 && <EmptyState icon="bell" title="No unread notifications" description="You're all caught up." />}
    </ScrollView>
    <BottomNavigation activeTab="Notifications" />
  </Screen>;
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 30, gap: 16 },
  sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 0.7, color: Colors.textSecondary, marginTop: 4 },
  list: { gap: 12 },
  notification: { flexDirection: 'row', gap: 12, padding: 14 },
  unread: { backgroundColor: Colors.primaryWash, borderColor: Colors.primaryLight },
  icon: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  notificationContent: { flex: 1, gap: 7 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { flex: 1, fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  unreadDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.primary },
  message: { fontSize: 13, lineHeight: 20, color: Colors.textSecondary },
  time: { fontSize: 11, color: Colors.textSecondary },
});
