import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@/components/ui/Icon';
import { C, NgoDesignNav, NgoLoadState, NgoTitleBar } from '@/components/ngo/NgoDesign';
import { useNgoDonations } from '@/store/ngoDonations.store';
import { ngoNotices, relativeTime } from '@/utils/ngoPresentation';

export default function Notifications() {
  const { available, mine, rejected, readNoticeIds, markNoticesRead, refresh, isLoading, error } = useNgoDonations();
  const [tab, setTab] = useState<'all' | 'unread'>('all');
  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));
  const notices = ngoNotices(available, mine, rejected);
  const unreadCount = notices.filter((notice) => !readNoticeIds.includes(notice.id)).length;
  const visible = tab === 'unread' ? notices.filter((notice) => !readNoticeIds.includes(notice.id)) : notices;
  return <View style={styles.root}><SafeAreaView edges={['top']} style={{ flex: 1 }}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
      <NgoTitleBar title="Notifications" />
      <View style={styles.tabsRow}>{(['all', 'unread'] as const).map((item) => <Pressable key={item} accessibilityRole="tab" accessibilityState={{ selected: tab === item }} onPress={() => setTab(item)} style={[styles.tab, tab === item && styles.tabActive]}><Text style={[styles.tabText, tab === item && styles.tabTextActive]}>{item === 'all' ? 'All' : `Unread (${unreadCount})`}</Text></Pressable>)}<Pressable style={styles.markAll} accessibilityRole="button" onPress={() => markNoticesRead(notices.map((notice) => notice.id))}><Text style={styles.markAllText}>Mark all read</Text></Pressable></View>
      <NgoLoadState loading={isLoading && notices.length === 0} error={error} retry={() => { void refresh(); }} />
      <View style={styles.list}>{visible.map((notice) => {
        const unread = !readNoticeIds.includes(notice.id);
        return <Pressable key={notice.id} style={[styles.card, unread && styles.cardUnread]} onPress={() => {
          markNoticesRead([notice.id]);
          if (!notice.rejected) router.push({ pathname: notice.available ? '/ngo/donationdetails' : '/ngo/activecollection', params: { id: notice.donationId } });
        }}><View style={[styles.iconWrap, notice.rejected && styles.iconWrapDanger, unread && styles.iconWrapUnread]}><Icon name={notice.icon} size={20} color={notice.rejected ? C.red : C.primaryDark} /></View><View style={{ flex: 1, marginLeft: 12 }}><Text style={styles.title}>{notice.title}</Text><Text style={styles.subtitle}>{notice.detail}</Text><Text style={styles.time}>{relativeTime(notice.createdAt)}</Text></View>{unread ? <View style={styles.unreadDot} /> : null}</Pressable>;
      })}{!isLoading && !error && visible.length === 0 ? <View style={styles.empty}><Text style={{ fontSize: 40 }}>🔔</Text><Text style={styles.emptyText}>{tab === 'unread' ? 'No unread notifications' : 'No notifications yet'}</Text></View> : null}</View>
    </ScrollView>
    <NgoDesignNav active="notifications" />
  </SafeAreaView></View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // Top bar
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backRow: { width: 90, paddingHorizontal: 20, paddingVertical: 14 },
  backText: { fontSize: 13, fontWeight: '800', color: C.primary, letterSpacing: 0.5 },
  topTitle: { fontSize: 17, fontWeight: '800', color: C.text, textAlign: 'center' },

  // Tabs
  tabsRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: 6, marginBottom: 14, gap: 8 },
  tab: { paddingHorizontal: 20, paddingVertical: 9, borderRadius: 20 },
  tabActive: { backgroundColor: C.primary },
  tabText: { fontSize: 13, fontWeight: '700', color: C.text },
  tabTextActive: { color: C.white },
  markAll: { marginLeft: 'auto' },
  markAllText: { fontSize: 13, fontWeight: '800', color: C.primary },

  // Cards
  list: { paddingHorizontal: 16, gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#0B3D2A',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardUnread: { backgroundColor: C.unreadBg, borderColor: C.unreadBorder },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: C.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapUnread: { backgroundColor: C.card },
  iconWrapDanger: { backgroundColor: C.redTint },
  title: { fontSize: 15, fontWeight: '800', color: C.text },
  subtitle: { fontSize: 12, color: C.muted, marginTop: 3 },
  time: { fontSize: 11, color: C.muted, marginTop: 4 },
  unreadDot: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: C.primary,
  },

  // Empty
  empty: { alignItems: 'center', paddingVertical: 50, gap: 8 },
  emptyText: { fontSize: 14, color: C.muted, fontWeight: '600' },

  // Bottom nav
  navWrap: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 12 },
  nav: {
    flexDirection: 'row',
    backgroundColor: C.card,
    borderRadius: 26,
    paddingVertical: 8,
    marginBottom: 6,
    shadowColor: '#0B3D2A',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -2 },
    elevation: 10,
  },
  navItem: { flex: 1, alignItems: 'center' },
  navIconWrap: { width: 50, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  navIconActive: { backgroundColor: C.tint },
  navLabel: { fontSize: 10, fontWeight: '600', color: C.muted, marginTop: 3 },
  navLabelActive: { color: C.primaryDark, fontWeight: '800' },
});