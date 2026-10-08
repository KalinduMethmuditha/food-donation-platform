import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppHeader from '@/components/restaurant/AppHeader';
import BottomNavigation from '@/components/restaurant/BottomNavigation';
import { useRestaurantData } from '@/components/restaurant/RestaurantDataProvider';
import EmptyState from '@/components/shared/EmptyState';
import Screen from '@/components/shared/Screen';
import Card from '@/components/ui/Card';
import Icon, { type IconName } from '@/components/ui/Icon';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { Colors } from '@/constants/colors';
import type { NotificationItem } from '@/types/notification';
import { formatDateTime } from '@/utils/dateTime';
import { getDonationActivity } from '@/utils/donation';

const notificationIcons: Record<NotificationItem['kind'], IconName> = {
  assigned: 'users', accepted: 'check', published: 'arrow-up', pickup: 'truck', arrived: 'pin', collected: 'gift', delivered: 'check', cancelled: 'check',
};

const notificationText: Record<NotificationItem['kind'], { title: string; message: (food: string) => string }> = {
  published: { title: 'Donation Published', message: (food) => `${food} was published successfully.` },
  accepted: { title: 'Donation Accepted', message: (food) => `${food} was accepted by an NGO.` },
  assigned: { title: 'Volunteer Assigned', message: (food) => `A volunteer was assigned to ${food}.` },
  pickup: { title: 'Pickup Started', message: (food) => `Collection has started for ${food}.` },
  arrived: { title: 'Volunteer Arrived', message: (food) => `The volunteer arrived to collect ${food}.` },
  collected: { title: 'Food Collected', message: (food) => `${food} was successfully collected.` },
  delivered: { title: 'Food Delivered', message: (food) => `${food} was delivered successfully.` },
  cancelled: { title: 'Donation Cancelled', message: (food) => `${food} was cancelled.` },
};

export default function NotificationsScreen() {
  const { donations, isLoading, loadError, refreshDonations } = useRestaurantData();
  useFocusEffect(useCallback(() => { void refreshDonations(); }, [refreshDonations]));
  const visibleNotifications: NotificationItem[] = getDonationActivity(donations).map((activity) => ({
    id: activity.id,
    donationId: activity.donationId,
    kind: activity.status,
    title: notificationText[activity.status].title,
    message: notificationText[activity.status].message(activity.foodType),
    time: formatDateTime(activity.createdAt),
  }));

  return <Screen>
    <AppHeader title="Notifications" />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>RECENT UPDATES</Text>
      {isLoading ? <ActivityIndicator color={Colors.primary} /> : null}
      {loadError ? <View style={styles.loadError}>
        <Text accessibilityRole="alert" style={styles.errorText}>{loadError}</Text>
        <SecondaryButton title="Retry" onPress={() => void refreshDonations()} />
      </View> : null}
      <View style={styles.list}>
        {visibleNotifications.map((notification) => <Card key={notification.id}
          style={styles.notification}>
          <View style={styles.icon}><Icon name={notificationIcons[notification.kind]} size={22} /></View>
          <View style={styles.notificationContent}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{notification.title}</Text>
            </View>
            <Text style={styles.message}>{notification.message}</Text>
            <Text style={styles.time}>{notification.time}</Text>
          </View>
        </Card>)}
      </View>
      {!isLoading && !loadError && visibleNotifications.length === 0 &&
        <EmptyState icon="bell" title="No updates yet" description="Donation updates will appear here." />}
    </ScrollView>
    <BottomNavigation activeTab="Notifications" />
  </Screen>;
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 30, gap: 16 },
  sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 0.7, color: Colors.textSecondary, marginTop: 4 },
  list: { gap: 12 },
  notification: { flexDirection: 'row', gap: 12, padding: 14 },
  icon: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  notificationContent: { flex: 1, gap: 7 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { flex: 1, fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  loadError: { gap: 8 },
  errorText: { color: Colors.danger, fontSize: 13 },
  message: { fontSize: 13, lineHeight: 20, color: Colors.textSecondary },
  time: { fontSize: 11, color: Colors.textSecondary },
});
