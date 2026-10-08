import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { Image } from 'react-native'; // <- uncomment if you use a real basket image
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@/components/ui/Icon';

// ---------- Colour palette (from the design) ----------
const C = {
  gradientTop: '#2FB584',
  gradientBottom: '#14855A',
  primary: '#1E9E6A',
  primaryDark: '#14855A',
  tint: '#E3F4EA',
  redTint: '#FDE4E4',
  red: '#E5484D',
  bg: '#F2F6F4',
  card: '#FFFFFF',
  border: '#E6ECE8',
  text: '#1B2B24',
  muted: '#8A9A93',
  white: '#FFFFFF',
};

const avatars = ['🥗', '🍞', '🍚'];

const stats = [
  { id: 'pending', value: 12, label: 'Pending', icon: 'clock' },
  { id: 'collection', value: 8, label: 'In Collection', icon: 'truck' },
  { id: 'completed', value: 25, label: 'Completed', icon: 'check' },
];

const activities = [
  { id: '1', type: 'accepted', title: 'Donation accepted', subtitle: 'Canned Food · 20 items', time: '2h ago', icon: 'check' },
  { id: '2', type: 'collected', title: 'Collection completed', subtitle: 'Clothes · 3 bags', time: '5h ago', icon: 'truck' },
  { id: '3', type: 'assigned', title: 'Volunteer assigned', subtitle: 'Ravi Kumar · Furniture', time: '1d ago', icon: 'user' },
  { id: '4', type: 'rejected', title: 'Donation rejected', subtitle: 'Books · 10 items', time: '2d ago', icon: 'x-circle' },
];

const navItems = [
  { id: 'home', label: 'Home', icon: 'home', route: null },
  { id: 'donations', label: 'Donations', icon: 'package', route: '/ngo/donations' },
  { id: 'collections', label: 'Collections', icon: 'truck', route: '/ngo/activecollection' },
  { id: 'notifications', label: 'Notifications', icon: 'bell', route: '/ngo/notifications' },
];

export default function NgoDashboard() {
  const activeTab = 'home';

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        {/* ================= HEADER ================= */}
        <LinearGradient colors={[C.gradientTop, C.gradientBottom]} style={styles.header}>
          <SafeAreaView edges={['top']}>
            <View style={styles.headerTop}>
              <TouchableOpacity style={styles.circleBtn}>
                <Icon name="menu" size={20} color={C.white} />
              </TouchableOpacity>

              <Text style={styles.headerTitle}>NGO Dashboard</Text>

              <TouchableOpacity style={styles.circleBtn} onPress={() => router.push('/ngo/notifications' as any)}>
                <Icon name="bell" size={20} color={C.white} />
                <View style={styles.badge} />
              </TouchableOpacity>
            </View>

            <View style={styles.welcomeRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.welcomeTitle}>Welcome back!</Text>
                <Text style={styles.welcomeSub}>Here's what's happening today</Text>
              </View>

              {/* Replace with: <Image source={require('@/assets/images/food-basket.png')} style={styles.basketImg} /> */}
              <View style={styles.basketBox}>
                <Text style={styles.basketEmoji}>🧺</Text>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* ================= DONATIONS CARD (overlaps header) ================= */}
        <View style={[styles.card, styles.donationCard]}>
          <View style={styles.donationTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.donationTitle}>New donations nearby</Text>
              <Text style={styles.donationSub}>5 new donations in your area</Text>
            </View>

            <View style={styles.avatarRow}>
              {avatars.map((e, i) => (
                <View key={i} style={[styles.avatar, i > 0 && { marginLeft: -10 }]}>
                  <Text style={{ fontSize: 14 }}>{e}</Text>
                </View>
              ))}
              <View style={styles.morePill}>
                <Text style={styles.moreText}>+2</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.85} onPress={() => router.push('/ngo/donations')}>
            <LinearGradient colors={[C.primary, C.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.viewBtn}>
              <Text style={styles.viewBtnText}>View Available Donations</Text>
              <Icon name="chevron-right" size={18} color={C.white} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* ================= STATS ================= */}
        <View style={styles.statsRow}>
          {stats.map((s) => (
            <View key={s.id} style={[styles.card, styles.statCard]}>
              <View style={styles.statIcon}>
                <Icon name={s.icon as any} size={14} color={C.primary} />
              </View>
              <Text style={styles.statNumber}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* ================= RECENT ACTIVITY ================= */}
        <View style={styles.activityHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, styles.activityCard]}>
          {activities.map((a, index) => {
            const rejected = a.type === 'rejected';
            return (
              <TouchableOpacity
                key={a.id}
                activeOpacity={0.7}
                style={[styles.activityItem, index < activities.length - 1 && styles.activityDivider]}
              >
                <View style={[styles.activityIcon, { backgroundColor: rejected ? C.redTint : C.tint }]}>
                  <Icon name={a.icon as any} size={18} color={rejected ? C.red : C.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.activityTitle}>{a.title}</Text>
                  <Text style={styles.activitySub}>{a.subtitle}</Text>
                </View>
                <Text style={styles.activityTime}>{a.time}</Text>
              </TouchableOpacity>
            );
          })}
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingBottom: 56,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: C.white },
  badge: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: C.red,
    borderWidth: 1.5,
    borderColor: C.primary,
  },

  welcomeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 22 },
  welcomeTitle: { fontSize: 26, fontWeight: '800', color: C.white },
  welcomeSub: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  basketBox: {
    width: 84,
    height: 84,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -20,
  },
  basketEmoji: { fontSize: 46 },
  basketImg: { width: 90, height: 90, resizeMode: 'contain', marginBottom: -20 },

  // Shared card
  card: {
    backgroundColor: C.card,
    borderRadius: 18,
    shadowColor: '#0B3D2A',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  // Donation card
  donationCard: { marginHorizontal: 16, marginTop: -34, padding: 16 },
  donationTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  donationTitle: { fontSize: 16, fontWeight: '800', color: C.text },
  donationSub: { fontSize: 12, color: C.muted, marginTop: 3 },
  avatarRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFF1DC',
    borderWidth: 2,
    borderColor: C.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  morePill: {
    marginLeft: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: C.tint,
  },
  moreText: { fontSize: 11, fontWeight: '700', color: C.primaryDark },
  viewBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  viewBtnText: { fontSize: 15, fontWeight: '700', color: C.white },

  // Stats
  statsRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginTop: 16 },
  statCard: { flex: 1, paddingVertical: 14, paddingHorizontal: 14 },
  statIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: C.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: { fontSize: 26, fontWeight: '800', color: C.text, marginTop: 14 },
  statLabel: { fontSize: 11, color: C.muted, marginTop: 2 },

  // Activity
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 22,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: C.text },
  seeAll: { fontSize: 13, fontWeight: '700', color: C.primary },
  activityCard: { marginHorizontal: 16, paddingHorizontal: 14 },
  activityItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  activityDivider: { borderBottomWidth: 1, borderBottomColor: C.border },
  activityIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityTitle: { fontSize: 14, fontWeight: '700', color: C.text },
  activitySub: { fontSize: 12, color: C.muted, marginTop: 2 },
  activityTime: { fontSize: 11, color: C.muted },

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
  navIconWrap: {
    width: 50,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIconActive: { backgroundColor: C.tint },
  navLabel: { fontSize: 10, fontWeight: '600', color: C.muted, marginTop: 3 },
  navLabelActive: { color: C.primaryDark },
});