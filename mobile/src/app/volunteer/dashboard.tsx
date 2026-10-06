import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import { mockVolunteer, mockActivePickup } from '@/data/mockVolunteerData';
import VolunteerBottomNav from '@/components/volunteer/VolunteerBottomNav';
import VolunteerQuickAction from '@/components/volunteer/VolunteerQuickAction';
import { useVolunteerStore } from '@/store/volunteerStore';

export default function DashboardScreen() {
  const { pickupStatus, notifications, activities, isAvailable } = useVolunteerStore();
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Get recent updates from activities (limit to 3)
  const recentUpdates = activities.slice(0, 3);

  const isActiveCompleted = pickupStatus === 'DELIVERED';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* ─── HEADER ─── */}
        <View style={styles.header}>
          <View style={styles.headerTextBox}>
            <Text style={styles.greeting}>Hi {mockVolunteer.fullName.split(' ')[0]} 👋</Text>
            <Text style={styles.subtitle}>
              {isAvailable ? 'Here are your assigned collections' : 'You are currently unavailable'}
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => router.push('/volunteer/notifications')} 
            style={styles.bellBox}
          >
            <Icon name="bell" size={24} color={Colors.textPrimary} />
            {unreadCount > 0 && <View style={styles.bellDot} />}
          </TouchableOpacity>
        </View>

        {/* ─── TODAY'S PICKUPS (GREEN CARD) ─── */}
        <View style={styles.todayCard}>
          <Text style={styles.todayTitle}>TODAY'S PICKUPS</Text>
          <View style={styles.todayRow}>
            <View>
              <Text style={styles.todayCount}>{isActiveCompleted ? '1' : '2'} Assigned</Text>
              <Text style={styles.todaySub}>
                {isActiveCompleted ? '1 pickup remaining' : 'Complete them before 6 PM'}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.viewNextBtn}
              onPress={() => router.push('/volunteer/pickup-details')}
            >
              <Text style={styles.viewNextText}>View Next</Text>
              <Icon name="chevron.right" size={16} color={Colors.primaryDark} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── ACTIVE PICKUP ─── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Pickup</Text>
          
          <View style={styles.activeCard}>
            <View style={styles.activeHeader}>
              <View style={styles.activeIconBox}>
                <Icon name="building" size={20} color={Colors.primaryDark} />
              </View>
              <View style={styles.activeTitleBox}>
                <Text style={styles.donorName}>{mockActivePickup.donor}</Text>
                <Text style={styles.pickupWindow}>{mockActivePickup.pickupWindow}</Text>
              </View>
              <View style={[styles.statusBadge, 
                  pickupStatus === 'DELIVERED' && { backgroundColor: Colors.surface, borderColor: Colors.border, borderWidth: 1 }
                ]}>
                <Text style={[styles.statusBadgeText, pickupStatus === 'DELIVERED' && { color: Colors.textSecondary }]}>
                  {pickupStatus}
                </Text>
              </View>
            </View>
            
            <View style={styles.activeDetails}>
              <View style={styles.detailRow}>
                <Icon name="map" size={16} color={Colors.textMuted} />
                <Text style={styles.detailText}>{mockActivePickup.distance} away</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              onPress={() => router.push('/volunteer/pickup-details')}
              style={styles.detailsBtn}
            >
              <Text style={styles.detailsBtnText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── QUICK ACTIONS ─── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickGrid}>
            <VolunteerQuickAction 
              icon="route" 
              title="Route" 
              onPress={() => router.push('/volunteer/route')} 
            />
            <VolunteerQuickAction 
              icon="check-circle" 
              title="Status" 
              onPress={() => router.push('/volunteer/collection-status')} 
            />
            <VolunteerQuickAction 
              icon="bell" 
              title="Alerts" 
              badge={unreadCount > 0 ? unreadCount : undefined}
              onPress={() => router.push('/volunteer/notifications')} 
            />
          </View>
        </View>

        {/* ─── RECENT UPDATES ─── */}
        <View style={styles.section}>
          <View style={styles.recentHeader}>
            <Text style={styles.sectionTitle}>Recent Updates</Text>
            <TouchableOpacity onPress={() => router.push('/volunteer/activity')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.recentCard}>
            {recentUpdates.length > 0 ? recentUpdates.map((update, index) => (
              <View key={update.id}>
                <View style={styles.updateRow}>
                  <View style={styles.updateIconBox}>
                    <Icon name={update.icon} size={16} color={Colors.primaryDark} />
                  </View>
                  <View style={styles.updateContent}>
                    <Text style={styles.updateTitle}>{update.title}</Text>
                    <Text style={styles.updateDesc} numberOfLines={1}>{update.description}</Text>
                  </View>
                  <Text style={styles.updateTime}>{update.time}</Text>
                </View>
                {index < recentUpdates.length - 1 && <View style={styles.divider} />}
              </View>
            )) : (
              <Text style={{color: Colors.textMuted, textAlign: 'center'}}>No recent updates.</Text>
            )}
            
            <View style={styles.tagRow}>
              {mockActivePickup.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

      </ScrollView>

      {/* ─── BOTTOM NAVIGATION ─── */}
      <VolunteerBottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, gap: 24, paddingBottom: 40 },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerTextBox: { flex: 1 },
  greeting: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  bellBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.danger,
    borderWidth: 1.5,
    borderColor: Colors.surface,
  },

  // Today Card
  todayCard: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  todayTitle: { fontSize: 12, fontWeight: '700', color: Colors.primaryLight, letterSpacing: 0.5, marginBottom: 8 },
  todayRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  todayCount: { fontSize: 24, fontWeight: '800', color: Colors.white },
  todaySub: { fontSize: 13, color: Colors.primaryLight, marginTop: 4 },
  viewNextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  viewNextText: { fontSize: 13, fontWeight: '700', color: Colors.primaryDark },

  // Sections
  section: { gap: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },

  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primaryDark,
    fontWeight: '600',
  },

  // Active Pickup Card
  activeCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 16,
  },
  activeHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  activeIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTitleBox: { flex: 1 },
  donorName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  pickupWindow: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  statusBadge: {
    backgroundColor: Colors.primaryWash,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: { fontSize: 10, fontWeight: '800', color: Colors.primaryDark, letterSpacing: 0.5 },
  activeDetails: { flexDirection: 'row', gap: 16 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  detailsBtn: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  detailsBtnText: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },

  // Quick Actions
  quickGrid: { flexDirection: 'row', gap: 12 },

  // Recent Updates Card
  recentCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 12,
  },
  updateRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  updateIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryWash,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateContent: { flex: 1, gap: 2 },
  updateTitle: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  updateDesc: { fontSize: 13, color: Colors.textSecondary },
  updateTime: { fontSize: 11, color: Colors.textMuted },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 4 },
  tagRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  tag: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary },
});
