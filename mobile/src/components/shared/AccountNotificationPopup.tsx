import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { AppState, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import Icon from '@/components/ui/Icon';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { Colors } from '@/constants/colors';
import type { UserRole } from '@/services/auth';
import { getUnreadNotifications, markAccountNotificationsRead, type AccountNotification } from '@/services/notifications';
import { useVolunteerAssignments } from '@/store/volunteerAssignments.store';
import { useVolunteerStore } from '@/store/volunteerStore';
import { useNgoDonations } from '@/store/ngoDonations.store';
import { formatDateTime } from '@/utils/dateTime';

const destinations = {
  ngo: '/ngo/donations', volunteer: '/volunteer/pickup-details',
  restaurant: '/restaurant/notifications', household: '/household/activity',
} as const;

export default function AccountNotificationPopup({ role }: { role: UserRole }) {
  const [notifications, setNotifications] = useState<AccountNotification[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const controller = useRef<AbortController | null>(null);
  const busy = useRef(false);
  const acknowledged = useRef(new Set<number>());
  const preferences = useVolunteerStore((state) => state.notificationPreferences);
  const enabled = role !== 'volunteer' || (preferences.generalNotifications && preferences.newPickupAssigned);

  useEffect(() => {
    const requestController = new AbortController();
    controller.current = requestController;
    let fetching = false;
    const refresh = async () => {
      if (!enabled || fetching || busy.current || AppState.currentState === 'background') return;
      fetching = true;
      try {
        const data = await getUnreadNotifications(requestController.signal);
        if (!requestController.signal.aborted && !busy.current && data.role === role) {
          setNotifications(data.notifications.filter((item) => !acknowledged.current.has(item.id)));
        }
      } catch {
        // Retry at the next interval or when the app returns to the foreground.
      } finally { fetching = false; }
    };
    void refresh();
    const interval = setInterval(() => { void refresh(); }, 30000);
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void refresh();
    });
    return () => {
      requestController.abort();
      clearInterval(interval);
      subscription.remove();
    };
  }, [role, enabled]);

  const acknowledge = async (openUpdates: boolean) => {
    if (busy.current || !controller.current || notifications.length === 0) return;
    busy.current = true;
    setSaving(true);
    setError('');
    const signal = controller.current.signal;
    try {
      const readIds = await markAccountNotificationsRead(notifications.map((item) => item.id), signal);
      if (signal.aborted) return;
      readIds.forEach((id) => acknowledged.current.add(id));
      if (role === 'volunteer') useVolunteerAssignments.setState({ readNotificationIds: readIds });
      if (role === 'ngo') useNgoDonations.getState().markNoticesRead(notifications.map((item) => `available-${item.donation_id}`));
      setNotifications([]);
      if (openUpdates) router.push(destinations[role]);
    } catch {
      if (!signal.aborted) setError('Could not save your notification reads. Please try again.');
    } finally {
      busy.current = false;
      if (!signal.aborted) setSaving(false);
    }
  };

  return <Modal visible={enabled && notifications.length > 0} transparent animationType="fade"
    onRequestClose={() => { void acknowledge(false); }}>
    <View style={styles.overlay}>
      <View style={styles.card} accessibilityViewIsModal>
        <View style={styles.heading}><View style={styles.icon}><Icon name="bell" size={24} color={Colors.primaryDark} /></View>
          <Text accessibilityRole="header" style={styles.title}>You have new updates</Text></View>
        <ScrollView style={styles.list} contentContainerStyle={styles.items}>
          {notifications.map((item) => <View key={item.id} style={styles.item}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.time}>{formatDateTime(item.created_at)}</Text>
          </View>)}
        </ScrollView>
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        <PrimaryButton title="View Updates" loading={saving} onPress={() => { void acknowledge(true); }} />
        <SecondaryButton title="Got It" disabled={saving} onPress={() => { void acknowledge(false); }} />
      </View>
    </View>
  </Modal>;
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(11,30,22,0.55)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { width: '100%', maxWidth: 420, maxHeight: '85%', backgroundColor: Colors.surface, borderRadius: 24, padding: 20, gap: 12 },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 46, height: 46, borderRadius: 23, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  list: { flexShrink: 1 },
  items: { gap: 12 },
  item: { padding: 14, borderRadius: 16, backgroundColor: Colors.primaryLight, gap: 6 },
  itemTitle: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary },
  message: { fontSize: 14, lineHeight: 21, color: Colors.textSecondary },
  time: { fontSize: 11, color: Colors.textMuted },
  error: { color: Colors.danger, fontSize: 13 },
});
