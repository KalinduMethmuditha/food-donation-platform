import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@/components/ui/Icon';

// ---------- Colour palette (same as other screens) ----------
const C = {
  gradientTop: '#2FB584',
  gradientBottom: '#14855A',
  primary: '#1E9E6A',
  primaryDark: '#14855A',
  tint: '#E3F4EA',
  unreadBg: '#DFF2E7',
  unreadBorder: '#BFE3CF',
  bg: '#F2F6F4',
  card: '#FFFFFF',
  border: '#E6ECE8',
  text: '#1B2B24',
  muted: '#8A9A93',
  red: '#E5484D',
  redTint: '#FDE4E4',
  white: '#FFFFFF',
};

type Notice = {
  id: string;
  icon: string;
  danger?: boolean;
  title: string;
  subtitle: string;
  time: string;
  unread: boolean;
};

// Mock data - replace with your API later
const initialNotices: Notice[] = [
  { id: '1', icon: 'gift', title: 'New donation request', subtitle: 'Canned Food, 20 items · Liverpool', time: '2 hours ago', unread: true },
  { id: '2', icon: 'check', title: 'Collection completed', subtitle: 'Ayesha delivered Clothes (3 bags)', time: '5 hours ago', unread: true },
  { id: '3', icon: 'user', title: 'Volunteer assigned', subtitle: 'Ravi Kumar assigned to Furniture', time: '1 day ago', unread: false },
  { id: '4', icon: 'x-circle', danger: true, title: 'Donation rejected', subtitle: 'Books (10 items) was declined', time: '2 days ago', unread: false },
  { id: '5', icon: 'clock', title: 'Pickup reminder', subtitle: 'Nimal Silva arrives at 4:30 PM', time: '2 days ago', unread: false },
  { id: '6', icon: 'truck', title: 'Item picked up', subtitle: 'Clothes are on the way to your NGO', time: '3 days ago', unread: false },
];

const navItems = [
  { id: 'home', label: 'Home', icon: 'home', route: '/ngo/dashboard' },
  { id: 'donations', label: 'Donations', icon: 'package', route: '/ngo/donations' },
  { id: 'collections', label: 'Collections', icon: 'truck', route: '/ngo/activecollection' },
  { id: 'notifications', label: 'Notifications', icon: 'bell', route: null },
];

export default function Notifications() {
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [tab, setTab] = useState<'all' | 'unread'>('all');
  const activeTab = 'notifications';

  const unreadCount = notices.filter((n) => n.unread).length;

  const visible = useMemo(
    () => (tab === 'unread' ? notices.filter((n) => n.unread) : notices),
    [notices, tab],
  );

  const markAllRead = () => setNotices((list) => list.map((n) => ({ ...n, unread: false })));
  const markRead = (id: string) =>
    setNotices((list) => list.map((n) => (n.id === id ? { ...n, unread: false } : n)));

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          {/* ================= TOP BAR ================= */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.backRow} onPress={() => router.back()} hitSlop={10}>
              <Text style={styles.backText}>‹ BACK</Text>
            </TouchableOpacity>
            <Text style={styles.topTitle}>Notifications</Text>
            <View style={styles.backRow} />
          </View>

          {/* ================= TABS ================= */}
          <View style={styles.tabsRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setTab('all')}
              style={[styles.tab, tab === 'all' && styles.tabActive]}
            >
              <Text style={[styles.tabText, tab === 'all' && styles.tabTextActive]}>All</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setTab('unread')}
              style={[styles.tab, tab === 'unread' && styles.tabActive]}
            >
              <Text style={[styles.tabText, tab === 'unread' && styles.tabTextActive]}>
                Unread ({unreadCount})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.markAll} onPress={markAllRead} hitSlop={8}>
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          </View>

          {/* ================= LIST ================= */}
          <View style={styles.list}>
            {visible.map((n) => (
              <TouchableOpacity
                key={n.id}
                activeOpacity={0.85}
                onPress={() => markRead(n.id)}
                style={[styles.card, n.unread && styles.cardUnread]}
              >
                <View style={[styles.iconWrap, n.danger && styles.iconWrapDanger, n.unread && styles.iconWrapUnread]}>
                  <Icon name={n.icon as any} size={20} color={n.danger ? C.red : C.primaryDark} />
                </View>

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.title}>{n.title}</Text>
                  <Text style={styles.subtitle}>{n.subtitle}</Text>
                  <Text style={styles.time}>{n.time}</Text>
                </View>

                {n.unread && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            ))}

            {visible.length === 0 && (
              <View style={styles.empty}>
                <Text style={{ fontSize: 40 }}>🔔</Text>
                <Text style={styles.emptyText}>No unread notifications</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* ================= BOTTOM NAV ================= */}
        <SafeAreaView edges={['bottom']} style={styles.navWrap}>
          <View style={styles.nav}>
            {navItems.map((n) => {
              const active = n.id === activeTab;
              return (
                <TouchableOpacity
                  key={n.id}
                  style={styles.navItem}
                  onPress={() => n.route && router.push(n.route as any)}
                >
                  <View style={[styles.navIconWrap, active && styles.navIconActive]}>
                    <Icon name={n.icon as any} size={20} color={active ? C.primaryDark : C.muted} />
                  </View>
                  <Text style={[styles.navLabel, active && styles.navLabelActive]}>{n.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </SafeAreaView>
      </SafeAreaView>
    </View>
  );
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