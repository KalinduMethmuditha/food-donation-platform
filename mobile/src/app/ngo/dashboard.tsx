import { router, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@/components/ui/Icon';
import { C, NgoDesignNav, NgoGradientButton, NgoLoadState } from '@/components/ngo/NgoDesign';
import { useNgoSession } from '@/components/ngo/NgoSessionContext';
import { useNgoDonations } from '@/store/ngoDonations.store';
import { logoutUser } from '@/services/auth';
import { foodVisual, ngoNotices, relativeTime } from '@/utils/ngoPresentation';

export default function NgoDashboard() {
  const user = useNgoSession();
  const { available, mine, rejected, readNoticeIds, refresh, isLoading, error } = useNgoDonations();
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));
  const notices = ngoNotices(available, mine, rejected);
  const activities = ngoNotices([], mine, rejected).slice(0, 4);
  const unread = notices.some((notice) => !readNoticeIds.includes(notice.id));
  const stats = [
    { id: 'pending', value: available.length, label: 'Pending', icon: 'clock' as const },
    { id: 'collection', value: mine.filter((item) => !['delivered', 'cancelled'].includes(item.status)).length, label: 'In Collection', icon: 'truck' as const },
    { id: 'completed', value: mine.filter((item) => item.status === 'delivered').length, label: 'Completed', icon: 'check' as const },
  ];
  const signOut = async () => {
    setSigningOut(true);
    try { await logoutUser(); } catch { /* Local authentication is cleared by logoutUser. */ }
    finally { router.replace('/welcome'); }
  };
  return <View style={styles.root}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
      <LinearGradient colors={[C.gradientTop, C.gradientBottom]} style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerTop}>
            <Pressable accessibilityRole="button" accessibilityLabel="Account menu" style={styles.circleBtn} onPress={() => setMenuOpen(true)}><Icon name="menu" size={20} color={C.white} /></Pressable>
            <Text style={styles.headerTitle}>Serve With Purpose</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Notifications" style={styles.circleBtn} onPress={() => router.push('/ngo/notifications')}><Icon name="bell" size={20} color={C.white} />{unread ? <View style={styles.badge} /> : null}</Pressable>
          </View>
          <View style={styles.welcomeRow}><View style={{ flex: 1 }}><Text style={styles.welcomeTitle}>{user?.name.trim() ? `Hi ${user.name.trim().split(/\s+/)[0]}!` : 'Welcome back!'}</Text><Text style={styles.welcomeSub}>Here&apos;s what&apos;s happening today</Text></View><View style={styles.basketBox}><Image source={require('../../../assets/images/food-basket.jpg')} style={styles.basketPhoto} resizeMode="contain" accessibilityLabel="Food donation basket" /></View></View>
        </SafeAreaView>
      </LinearGradient>
      <View style={[styles.card, styles.donationCard]}>
        <View style={styles.donationTop}><View style={{ flex: 1 }}><Text style={styles.donationTitle}>New donations available</Text><Text style={styles.donationSub}>{available.length} published donations to review</Text></View>
          <View style={styles.avatarRow}>{available.slice(0, 3).map((item, index) => <View key={item.id} style={[styles.avatar, index > 0 && { marginLeft: -10 }]}><Text>{foodVisual(item.foodType).emoji}</Text></View>)}{available.length > 3 ? <View style={styles.morePill}><Text style={styles.moreText}>+{available.length - 3}</Text></View> : null}</View>
        </View>
        <NgoGradientButton title="View Available Donations" icon="chevron-right" onPress={() => router.push('/ngo/donations')} />
      </View>
      <View style={styles.statsRow}>{stats.map((stat) => <View key={stat.id} style={[styles.card, styles.statCard]}><View style={styles.statIcon}><Icon name={stat.icon} size={14} color={C.primary} /></View><Text style={styles.statNumber}>{stat.value}</Text><Text style={styles.statLabel}>{stat.label}</Text></View>)}</View>
      <NgoLoadState loading={isLoading && mine.length === 0} error={error} retry={() => { void refresh(); }} />
      <View style={styles.activityHeader}><Text style={styles.sectionTitle}>Recent Activity</Text><Pressable accessibilityRole="button" onPress={() => router.push('/ngo/notifications')}><Text style={styles.seeAll}>See all</Text></Pressable></View>
      <View style={[styles.card, styles.activityCard]}>{activities.map((item, index) => <Pressable key={item.id} style={[styles.activityItem, index < activities.length - 1 && styles.activityDivider]} onPress={() => router.push(item.rejected ? '/ngo/notifications' : { pathname: '/ngo/activecollection', params: { id: item.donationId } })}>
        <View style={[styles.activityIcon, { backgroundColor: item.rejected ? C.redTint : C.tint }]}><Icon name={item.icon} size={18} color={item.rejected ? C.red : C.primary} /></View><View style={{ flex: 1 }}><Text style={styles.activityTitle}>{item.title}</Text><Text style={styles.activitySub}>{item.detail}</Text></View><Text style={styles.activityTime}>{relativeTime(item.createdAt)}</Text>
      </Pressable>)}{!isLoading && activities.length === 0 ? <Text style={[styles.activitySub, { paddingVertical: 20 }]}>Your donation activity will appear here.</Text> : null}</View>
    </ScrollView>
    <NgoDesignNav active="home" />
    <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
      <View style={{ flex: 1, backgroundColor: 'rgba(11,30,22,0.55)', justifyContent: 'center', padding: 24 }}><View style={[styles.card, { padding: 24, gap: 16, width: '100%', maxWidth: 360, alignSelf: 'center' }]}><Text style={styles.sectionTitle}>{user?.name}</Text><Text style={styles.donationSub}>NGO account</Text><NgoGradientButton title={signingOut ? 'Signing out...' : 'Sign out'} loading={signingOut} onPress={() => { void signOut(); }} /><Pressable onPress={() => setMenuOpen(false)}><Text style={[styles.seeAll, { textAlign: 'center' }]}>Close</Text></Pressable></View></View>
    </Modal>
  </View>;
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
  headerTitle: { flex: 1, paddingHorizontal: 8, textAlign: 'center', fontSize: 17, fontWeight: '700', color: C.white },
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
    width: 96,
    height: 96,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: C.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -20,
  },
  basketPhoto: { width: 92, height: 92 },

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
