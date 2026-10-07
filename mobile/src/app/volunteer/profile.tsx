import { router } from 'expo-router';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import VolunteerBottomNav from '@/components/volunteer/VolunteerBottomNav';
import { useVolunteerStore } from '@/store/volunteerStore';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type NavRoute =
  | '/volunteer/dashboard'
  | '/volunteer/edit-profile'
  | '/volunteer/notification-preferences'
  | '/volunteer/pickup-preferences'
  | '/volunteer/help-support'
  | '/volunteer/activity'
  | '/volunteer/about'
  | '/volunteer/privacy'
  | '/volunteer/terms';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

interface InfoRowProps {
  label: string;
  value: string;
  isLast?: boolean;
}

function InfoRow({ label, value, isLast = false }: InfoRowProps) {
  return (
    <>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue} numberOfLines={1} ellipsizeMode="tail">
          {value}
        </Text>
      </View>
      {!isLast && <View style={styles.rowDivider} />}
    </>
  );
}


interface MenuRowProps {
  iconName: any;
  label: string;
  onPress: () => void;
  isLast?: boolean;
  danger?: boolean;
}

function MenuRow({ iconName, label, onPress, isLast = false, danger = false }: MenuRowProps) {
  return (
    <>
      <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={0.7}>
        <View style={[styles.menuIconWrap, danger && styles.menuIconWrapDanger]}>
          <Icon name={iconName} size={18} color={danger ? Colors.danger : Colors.primary} />
        </View>
        <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
        <Icon name="chevron-right" size={18} color={Colors.textMuted} />
      </TouchableOpacity>
      {!isLast && <View style={styles.rowDivider} />}
    </>
  );
}

interface StatBoxProps {
  value: string;
  label: string;
}

function StatBox({ value, label }: StatBoxProps) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────────────────────────────────────

export default function VolunteerProfileScreen() {
  const { profile, pickupPreferences } = useVolunteerStore();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const initials = getInitials(profile.fullName);
  const availabilityLabel = pickupPreferences.availableToday ? 'Available Today' : 'Not Available';
  const timeRange = `${pickupPreferences.preferredStartTime} – ${pickupPreferences.preferredEndTime}`;

  function handleLogout() {
    setLogoutModalVisible(false);
    router.replace('/login');
  }

  function handleNavPress(tab: string) {
    const routes: Record<string, string> = {
      Home: '/volunteer/dashboard',
      Pickups: '/volunteer/pickups',
      Notifications: '/volunteer/notifications',
      Profile: '/volunteer/profile',
    };
    const route = routes[tab];
    if (route) router.push(route as any);
  }

  return (
    <View style={styles.root}>
      {/* ── Header ── */}
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.push('/volunteer/dashboard')}
            activeOpacity={0.7}
          >
            <Icon name="arrow-left" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          {/* Spacer to centre the title */}
          <View style={styles.backBtn} />
        </View>
      </SafeAreaView>

      {/* ── Body ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Profile Header Card ── */}
        <View style={styles.profileCard}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            {profile.avatarUrl ? (
              <Image source={{ uri: profile.avatarUrl }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
            )}
          </View>

          {/* Name & subtitle */}
          <Text style={styles.profileName}>{profile.fullName}</Text>
          <Text style={styles.profileSubtitle}>Volunteer</Text>

          {/* Active badge */}
          <View style={styles.activeBadge}>
            <View style={styles.activeDot} />
            <Text style={styles.activeBadgeText}>Active Volunteer</Text>
          </View>

          {/* Volunteer ID */}
          <Text style={styles.volunteerId}>ID: {profile.volunteerId}</Text>
        </View>

        {/* ── Personal Information ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          <InfoRow label="Name" value={profile.fullName} />
          <InfoRow label="Phone" value={profile.phone} />
          <InfoRow label="Email" value={profile.email} />
          <InfoRow label="Location" value={profile.location} />
          <InfoRow label="Joined" value={profile.joinedDate} isLast />
        </View>

        {/* ── Pickup Preferences Summary ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pickup Preferences</Text>
          <InfoRow label="Preferred Area" value={pickupPreferences.preferredArea} />
          <InfoRow label="Preferred Time" value={timeRange} />
          <InfoRow
            label="Availability"
            value={availabilityLabel}
          />
          <InfoRow label="Pickup Radius" value={pickupPreferences.pickupRadius} isLast />
        </View>

        {/* ── Statistics ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            <StatBox value="24" label="Completed Pickups" />
            <StatBox value="286" label="Food Packs" />
            <StatBox value="21" label="Deliveries" />
            <StatBox value="96%" label="Completion Rate" />
          </View>
        </View>

        {/* ── Account & Preferences ── */}
        <Text style={styles.sectionHeader}>Account &amp; Preferences</Text>
        <View style={styles.card}>
          <MenuRow
            iconName="person"
            label="Edit Profile"
            onPress={() => router.push('/volunteer/edit-profile')}
          />
          <MenuRow
            iconName="bell"
            label="Notification Preferences"
            onPress={() => router.push('/volunteer/notification-preferences')}
          />
          <MenuRow
            iconName="package"
            label="Pickup Preferences"
            onPress={() => router.push('/volunteer/pickup-preferences')}
          />
          <MenuRow
            iconName="questionmark.circle"
            label="Help &amp; Support"
            onPress={() => router.push('/volunteer/help-support')}
          />
          <MenuRow
            iconName="activity"
            label="Activity"
            onPress={() => router.push('/volunteer/activity')}
            isLast
          />
        </View>

        {/* ── More ── */}
        <Text style={styles.sectionHeader}>More</Text>
        <View style={styles.card}>
          <MenuRow
            iconName="info"
            label="About App"
            onPress={() => router.push('/volunteer/about')}
          />
          <MenuRow
            iconName="person"
            label="Privacy"
            onPress={() => router.push('/volunteer/privacy')}
          />
          <MenuRow
            iconName="check"
            label="Terms"
            onPress={() => router.push('/volunteer/terms')}
            isLast
          />
        </View>

        {/* ── Logout Button ── */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => setLogoutModalVisible(true)}
          activeOpacity={0.8}
        >
          <Icon name="arrow.right.square" size={20} color={Colors.white} />
          <Text style={styles.logoutBtnText}>Log Out</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* ── Bottom Nav ── */}
      <VolunteerBottomNav activeTab="Profile" onPress={handleNavPress} />

      {/* ── Logout Modal ── */}
      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setLogoutModalVisible(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            {/* Icon */}
            <View style={styles.modalIconWrap}>
              <Icon name="arrow.right.square" size={28} color={Colors.danger} />
            </View>

            <Text style={styles.modalTitle}>Log out?</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to log out of your volunteer account?
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setLogoutModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalLogoutBtn}
                onPress={handleLogout}
                activeOpacity={0.8}
              >
                <Text style={styles.modalLogoutText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Layout
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Header
  headerSafe: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },

  // Profile Header Card
  profileCard: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 16,
    // Shadow
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarContainer: {
    marginBottom: 14,
  },
  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarFallback: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#047857',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  avatarInitials: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 2,
    textAlign: 'center',
  },
  profileSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
    marginBottom: 12,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 10,
    gap: 6,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6EE7B7',
  },
  activeBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.white,
  },
  volunteerId: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
    letterSpacing: 0.5,
  },

  // Card
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 14,
    letterSpacing: 0.1,
  },

  // Info Row
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '500',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
    flex: 1.5,
    textAlign: 'right',
  },
  rowDivider: {
    height: 1,
    backgroundColor: Colors.border,
    opacity: 0.7,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.primaryWash,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.primaryDark,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 15,
  },

  // Section Header
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },

  // Menu Row
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    gap: 12,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primaryWash,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconWrapDanger: {
    backgroundColor: '#FEF2F2',
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  menuLabelDanger: {
    color: Colors.danger,
  },

  // Logout Button
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.danger,
    borderRadius: 14,
    paddingVertical: 15,
    gap: 10,
    marginTop: 4,
    shadowColor: Colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.3,
  },

  bottomSpacer: { height: 16 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  modalCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  modalLogoutBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: Colors.danger,
    alignItems: 'center',
    shadowColor: Colors.danger,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  modalLogoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
});
