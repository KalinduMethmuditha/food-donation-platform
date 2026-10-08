import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import Icon from '@/components/ui/Icon';
import { NgoBottomNav, NgoCard, NgoColors, NgoHeader } from '@/components/ngo/NgoUI';
import { useNgoDonations } from '@/store/ngoDonations.store';
import { formatDateTime } from '@/utils/dateTime';
import { getDonationStatusLabel } from '@/utils/donation';

type Notice = {
  id: string;
  donationId: string;
  title: string;
  detail: string;
  createdAt: string;
  available: boolean;
};

export default function NgoNotifications() {
  const available = useNgoDonations((state) => state.available);
  const mine = useNgoDonations((state) => state.mine);
  const readIds = useNgoDonations((state) => state.readNoticeIds);
  const markRead = useNgoDonations((state) => state.markNoticesRead);
  const refresh = useNgoDonations((state) => state.refresh);
  const isLoading = useNgoDonations((state) => state.isLoading);
  const error = useNgoDonations((state) => state.error);
  const [tab, setTab] = useState<'all' | 'unread'>('all');

  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));

  const notices = useMemo<Notice[]>(() => [
    ...available.map((item) => ({
      id: `available-${item.id}`,
      donationId: item.id,
      title: 'New donation available',
      detail: `${item.foodType} from ${item.donorName} (${item.donorRole})`,
      createdAt: item.createdAt ?? '',
      available: true,
    })),
    ...mine.map((item) => {
      const latestStatus = item.statusLogs?.filter((log) => log.status === item.status).at(-1);
      return {
        id: `status-${item.id}-${item.status}`,
        donationId: item.id,
        title: getDonationStatusLabel(item.status),
        detail: `${item.foodType} · ${latestStatus?.note ?? item.volunteerName ?? item.donorName}`,
        createdAt: latestStatus?.createdAt ?? item.createdAt ?? '',
        available: false,
      };
    }),
  ].sort((a, b) => (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0)), [available, mine]);

  const unreadCount = notices.filter((item) => !readIds.includes(item.id)).length;
  const visible = tab === 'unread' ? notices.filter((item) => !readIds.includes(item.id)) : notices;

  const openNotice = (notice: Notice) => {
    markRead([notice.id]);
    router.push({
      pathname: (notice.available ? '/ngo/donationdetails' : '/ngo/activecollection') as any,
      params: { id: notice.donationId },
    });
  };

  return (
    <View style={styles.root}>
      <NgoHeader title="Notifications" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.tabs}>
          {(['all', 'unread'] as const).map((item) => (
            <Pressable key={item} onPress={() => setTab(item)} accessibilityRole="tab" accessibilityState={{ selected: tab === item }} style={[styles.tab, tab === item && styles.tabActive]}>
              <Text style={[styles.tabText, tab === item && styles.tabTextActive]}>{item === 'all' ? 'All' : `Unread (${unreadCount})`}</Text>
            </Pressable>
          ))}
          <Pressable onPress={() => markRead(notices.map((item) => item.id))} accessibilityRole="button"><Text style={styles.markAll}>Mark all read</Text></Pressable>
        </View>
        {isLoading && notices.length === 0 ? <ActivityIndicator color={NgoColors.primary} /> : null}
        {error ? <NgoCard><Text accessibilityRole="alert" style={styles.error}>{error}</Text></NgoCard> : null}
        <View style={styles.list}>
          {visible.map((notice) => {
            const unread = !readIds.includes(notice.id);
            return (
              <Pressable key={notice.id} onPress={() => openNotice(notice)} accessibilityRole="button" style={[styles.notice, unread && styles.unread]}>
                <View style={styles.icon}><Icon name={notice.available ? 'gift' : 'truck'} size={20} color={NgoColors.primaryDark} /></View>
                <View style={styles.noticeBody}>
                  <Text style={styles.title}>{notice.title}</Text>
                  <Text style={styles.detail}>{notice.detail}</Text>
                  <Text style={styles.time}>{formatDateTime(notice.createdAt)}</Text>
                </View>
                {unread ? <View style={styles.dot} /> : null}
              </Pressable>
            );
          })}
        </View>
        {!isLoading && !error && visible.length === 0 ? <NgoCard><Text style={styles.detail}>{tab === 'unread' ? 'No unread notifications.' : 'Donation updates will appear here.'}</Text></NgoCard> : null}
      </ScrollView>
      <NgoBottomNav active="notifications" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: NgoColors.bg },
  content: { padding: 16, paddingBottom: 32, gap: 14 },
  tabs: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tab: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 18, backgroundColor: NgoColors.card },
  tabActive: { backgroundColor: NgoColors.primaryDark },
  tabText: { color: NgoColors.text, fontSize: 12, fontWeight: '700' },
  tabTextActive: { color: NgoColors.white },
  markAll: { color: NgoColors.primaryDark, fontWeight: '800', fontSize: 12, marginLeft: 'auto' },
  list: { gap: 10 },
  notice: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, backgroundColor: NgoColors.card, borderWidth: 1, borderColor: NgoColors.border },
  unread: { backgroundColor: NgoColors.tint, borderColor: NgoColors.primary },
  icon: { width: 42, height: 42, borderRadius: 21, backgroundColor: NgoColors.white, alignItems: 'center', justifyContent: 'center' },
  noticeBody: { flex: 1 },
  title: { color: NgoColors.text, fontWeight: '800' },
  detail: { color: NgoColors.muted, fontSize: 12, lineHeight: 18, marginTop: 3 },
  time: { color: NgoColors.muted, fontSize: 11, marginTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: NgoColors.primaryDark },
  error: { color: NgoColors.danger },
});
