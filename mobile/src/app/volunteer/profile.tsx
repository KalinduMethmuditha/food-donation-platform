import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, Switch, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';
import { useVolunteerStore } from '@/store/volunteerStore';
import type { IconName } from '@/components/ui/Icon';

export default function ProfileScreen() {
  const { isAvailable, toggleAvailability, pickupStatus, profile, pickupPreferences, logout } = useVolunteerStore();
  const [logoutVisible, setLogoutVisible] = useState(false);

  const renderAction = (icon: IconName, title: string, route: any, color = Colors.textPrimary) => (
    <TouchableOpacity style={styles.actionRow} activeOpacity={0.7} onPress={() => router.push(route)}>
      <View style={styles.actionIcon}>
        <Icon name={icon} size={20} color={color} />
      </View>
      <Text style={[styles.actionTitle, { color }]}>{title}</Text>
      <Icon name="chevron.right" size={16} color={Colors.border} />
    </TouchableOpacity>
  );

  const handleLogout = () => {
    setLogoutVisible(false);
    logout();
    router.replace('/volunteer/welcome');
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <VolunteerScreenHeader title="Profile" onBack={() => router.replace('/volunteer/dashboard')} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(profile.fullName)}</Text>
            <View style={styles.verifiedBadge}>
              <Icon name="checkmark.seal.fill" size={12} color={Colors.white} />
            </View>
          </View>
          <Text style={styles.name}>{profile.fullName}</Text>
          <Text style={styles.role}>Volunteer • <Text style={{ color: Colors.primaryDark }}>Active</Text></Text>
          <Text style={styles.idText}>Volunteer ID: {profile.volunteerId}</Text>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{profile.fullName}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{profile.phone}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{profile.email}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{profile.location}</Text>
            </View>
          </View>
        </View>

        {/* Pickup Preferences Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup Preferences</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Preferred Area</Text>
              <Text style={styles.infoValue}>{pickupPreferences.preferredArea}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Preferred Time</Text>
              <Text style={styles.infoValue}>{pickupPreferences.preferredStartTime} – {pickupPreferences.preferredEndTime}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.availabilityRow}>
              <Text style={styles.infoLabel}>Availability</Text>
              <View style={styles.switchRow}>
                <Text style={[styles.infoValue, { marginRight: 8, color: isAvailable ? Colors.primaryDark : Colors.textMuted }]}>
                  {isAvailable ? 'Available' : 'Unavailable'}
                </Text>
                <Switch
                  value={isAvailable}
                  onValueChange={toggleAvailability}
                  trackColor={{ false: Colors.border, true: Colors.primary }}
                  thumbColor={Colors.white}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Volunteer Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Volunteer Statistics</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Completed Pickups</Text>
              <Text style={styles.infoValue}>{pickupStatus === 'DELIVERED' ? '25' : '24'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Food Packs Collected</Text>
              <Text style={styles.infoValue}>286</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Deliveries</Text>
              <Text style={styles.infoValue}>21</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Completion Rate</Text>
              <Text style={[styles.infoValue, { color: Colors.primaryDark }]}>96%</Text>
            </View>
          </View>
        </View>

        {/* Account & Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account & Preferences</Text>
          <View style={styles.card}>
            {renderAction('person', 'Edit Profile', '/volunteer/edit-profile')}
            <View style={styles.divider} />
            {renderAction('bell', 'Notification Preferences', '/volunteer/notification-preferences')}
            <View style={styles.divider} />
            {renderAction('settings', 'Pickup Preferences', '/volunteer/pickup-preferences')}
            <View style={styles.divider} />
            {renderAction('questionmark.circle', 'Help & Support', '/volunteer/help-support')}
            <View style={styles.divider} />
            {renderAction('activity', 'Activity', '/volunteer/activity')}
          </View>
        </View>

        {/* More */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More</Text>
          <View style={styles.card}>
            {renderAction('info', 'About App', '/volunteer/about')}
            <View style={styles.divider} />
            {renderAction('building', 'Privacy', '/volunteer/privacy')}
            <View style={styles.divider} />
            {renderAction('check', 'Terms', '/volunteer/terms')}
          </View>
        </View>

        {/* Log Out */}
        <TouchableOpacity style={styles.logoutBtn} onPress={() => setLogoutVisible(true)}>
          <Text style={styles.logoutBtnText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Logout Modal */}
      <Modal visible={logoutVisible} transparent animationType="fade" onRequestClose={() => setLogoutVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconBox}>
              <Icon name="arrow.right.square" size={24} color={Colors.danger} />
            </View>
            <Text style={styles.modalTitle}>Log out?</Text>
            <Text style={styles.modalDesc}>Are you sure you want to log out of your volunteer account?</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setLogoutVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalLogoutBtn} onPress={handleLogout}>
                <Text style={styles.modalLogoutText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, gap: 24, paddingBottom: 40 },

  profileHeader: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.white,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  role: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  idText: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 6,
    fontFamily: 'monospace',
  },

  section: { gap: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary, marginLeft: 4 },
  
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  infoValue: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, textAlign: 'right', flex: 1, marginLeft: 16 },
  
  divider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 16 },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.primaryWash,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },

  logoutBtn: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  logoutBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.danger,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    alignItems: 'center',
  },
  modalIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8 },
  modalDesc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  modalActions: { flexDirection: 'row', gap: 12 },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  modalCancelText: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  modalLogoutBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.danger,
    alignItems: 'center',
  },
  modalLogoutText: { fontSize: 15, fontWeight: '700', color: Colors.white },
});
