import { useState } from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import AppHeader from '@/components/restaurant/AppHeader';
import BottomNavigation from '@/components/restaurant/BottomNavigation';
import { Colors } from '@/constants/colors';

type Filter = 'all' | 'unread';

type NotificationItem = {
  id: number;
  title: string;
  message: string;
  time: string;
  icon: string;
  unread: boolean;
};

const notifications: NotificationItem[] = [
  {
    id: 1,
    title: 'Volunteer Assigned',
    message: 'S. Perera was assigned to collect your Rice & Curry donation.',
    time: '12:32 PM',
    icon: 'V',
    unread: true,
  },
  {
    id: 2,
    title: 'NGO Accepted Donation',
    message: 'Hope Community NGO accepted your Rice & Curry donation.',
    time: '12:18 PM',
    icon: '✓',
    unread: true,
  },
  {
    id: 3,
    title: 'Donation Published',
    message: 'Nearby NGOs and volunteers were notified.',
    time: '12:05 PM',
    icon: '↑',
    unread: false,
  },
  {
    id: 4,
    title: 'Food Collected',
    message: 'Your Bakery Items donation was successfully collected.',
    time: 'Yesterday, 5:10 PM',
    icon: '✓',
    unread: false,
  },
];

export default function NotificationsScreen() {
  const [filter, setFilter] = useState<Filter>('all');

  const visibleNotifications =
    filter === 'all'
      ? notifications
      : notifications.filter(
          (notification) => notification.unread
        );

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  return (
    <View style={styles.screen}>
      <AppHeader title="Notifications" />

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filter,
            filter === 'all' && styles.activeFilter,
          ]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[
              styles.filterText,
              filter === 'all' && styles.activeFilterText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filter,
            filter === 'unread' && styles.activeFilter,
          ]}
          onPress={() => setFilter('unread')}
        >
          <Text
            style={[
              styles.filterText,
              filter === 'unread' && styles.activeFilterText,
            ]}
          >
            Unread ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>
          {filter === 'all'
            ? 'RECENT UPDATES'
            : 'UNREAD UPDATES'}
        </Text>

        <View style={styles.list}>
          {visibleNotifications.map((notification) => (
            <View
              key={notification.id}
              style={[
                styles.notificationCard,
                notification.unread &&
                  styles.unreadNotification,
              ]}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>
                  {notification.icon}
                </Text>
              </View>

              <View style={styles.notificationContent}>
                <View style={styles.titleRow}>
                  <Text style={styles.notificationTitle}>
                    {notification.title}
                  </Text>

                  {notification.unread && (
                    <View style={styles.unreadDot} />
                  )}
                </View>

                <Text style={styles.message}>
                  {notification.message}
                </Text>

                <Text style={styles.time}>
                  {notification.time}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {visibleNotifications.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              No unread notifications
            </Text>

            <Text style={styles.emptyText}>
              You're all caught up.
            </Text>
          </View>
        )}
      </ScrollView>

      <BottomNavigation activeTab="Notifications" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 8,
  },

  filter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },

  activeFilter: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },

  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  activeFilterText: {
    color: Colors.primaryDark,
  },

  scrollView: {
    flex: 1,
  },

  content: {
    padding: 16,
    paddingBottom: 30,
  },

  sectionTitle: {
    marginBottom: 10,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },

  list: {
    gap: 10,
  },

  notificationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
  },

  unreadNotification: {
    borderColor: Colors.primary,
    backgroundColor: '#F7FFFB',
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primaryDark,
  },

  notificationContent: {
    flex: 1,
    marginLeft: 12,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  notificationTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },

  message: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    color: Colors.textSecondary,
  },

  time: {
    marginTop: 7,
    fontSize: 10,
    color: Colors.textMuted,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  emptyText: {
    marginTop: 5,
    fontSize: 12,
    color: Colors.textSecondary,
  },
});