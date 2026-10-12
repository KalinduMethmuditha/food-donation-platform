import { router, useFocusEffect, type Href } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from '@/components/shared/Screen';
import AppHeader from '@/components/shared/AppHeader';
import RoleProfileNavigation from '@/components/shared/RoleProfileNavigation';
import Card from '@/components/ui/Card';
import Icon, { type IconName } from '@/components/ui/Icon';
import FormField from '@/components/ui/FormField';
import PasswordField from '@/components/auth/PasswordField';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { Colors } from '@/constants/colors';
import { logoutUser, type UserRole } from '@/services/auth';
import { deleteAccount, getAccountProfile, sendAccountSupportRequest, setAccountNotifications, type AccountStatistics } from '@/services/account';
import { getAccountErrorMessage } from '@/services/apiErrors';
import { useAccountStore } from '@/store/account.store';
import { useVolunteerStore } from '@/store/volunteerStore';
import { useVolunteerAssignments } from '@/store/volunteerAssignments.store';

const roleLabels = { restaurant: 'Restaurant Donor', household: 'Household Donor', ngo: 'NGO', volunteer: 'Volunteer' };
const information = {
  about: ['About App', 'Serve With Purpose connects restaurant and household donors with NGOs and volunteers. Share surplus food, coordinate collections, and track deliveries.\n\nVersion 1.0.0'],
  privacy: ['Data & Privacy', 'Your account stores your name, email, optional phone and location, profile photo, and notification preferences. Donation participants can view the details needed to coordinate a pickup.\n\nDeleting your account removes access and personal profile details. Completed donation records remain with an anonymized account for other participants.'],
  terms: ['Community Guidelines', 'Publish accurate food quantities and pickup deadlines. Share food that is safe to consume. NGOs should coordinate collections and volunteers should keep pickup and delivery statuses accurate.\n\nUse Help & Support to report an issue.'],
} as const;
type Dialog = 'delete' | 'logout' | 'notifications' | 'support' | keyof typeof information | null;

function InfoRow({ label, value }: { label: string; value: string }) {
  return <View style={styles.infoRow}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value || 'Not provided'}</Text></View>;
}
function MenuRow({ label, icon, onPress, danger }: { label: string; icon: IconName; onPress: () => void; danger?: boolean }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={styles.menuRow}>
    <View style={styles.menuIcon}><Icon name={icon} size={19} color={danger ? Colors.danger : Colors.primaryDark} /></View>
    <Text style={[styles.menuLabel, danger && styles.error]}>{label}</Text><Icon name="chevron-right" size={18} color={Colors.textMuted} />
  </Pressable>;
}

export default function AccountProfileScreen({ role }: { role: UserRole }) {
  const user = useAccountStore((state) => state.user);
  const pickupPreferences = useVolunteerStore((state) => state.pickupPreferences);
  const isAvailable = useVolunteerAssignments((state) => state.isAvailable);
  const [statistics, setStatistics] = useState<AccountStatistics>({ total: 0, active: 0, delivered: 0, collected: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const profileController = useRef<AbortController | null>(null);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [password, setPassword] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [dialogError, setDialogError] = useState('');
  const loadProfile = useCallback((signal: AbortSignal) => {
    setLoading(true);
    void getAccountProfile(signal).then((data) => {
      if (!signal.aborted) {
        if (data.user.role !== role) { router.replace(`/${data.user.role}/dashboard` as Href); return; }
        setStatistics(data.statistics); setError('');
      }
    }).catch((cause) => { if (!signal.aborted) setError(getAccountErrorMessage(cause)); })
      .finally(() => { if (!signal.aborted) setLoading(false); });
  }, [role]);
  useFocusEffect(useCallback(() => {
    const controller = new AbortController();
    profileController.current = controller;
    loadProfile(controller.signal);
    return () => controller.abort();
  }, [loadProfile]));
  const openDialog = (next: Dialog) => { setDialog(next); setDialogError(''); setSuccess(''); setPassword(''); };
  const closeDialog = () => { if (!saving) setDialog(null); };
  const perform = async (operation: () => Promise<unknown>, next?: () => void) => {
    if (saving) return;
    setSaving(true); setDialogError('');
    try { await operation(); next?.(); }
    catch (cause) { setDialogError(getAccountErrorMessage(cause)); }
    finally { setSaving(false); }
  };
  const name = user?.name ?? '';
  const statLabels = role === 'volunteer' ? ['Assigned Pickups', 'Active Pickups', 'Completed Pickups', 'Deliveries']
    : role === 'ngo' ? ['Accepted Donations', 'Active Collections', 'Collected', 'Delivered']
      : ['Total Donations', 'Active Donations', 'Collected', 'Delivered'];
  const statValues = [statistics.total, statistics.active, statistics.collected, statistics.delivered];
  const activityRoute = role === 'ngo' ? '/ngo/notifications' : role === 'volunteer' ? '/volunteer/activity'
    : role === 'household' ? '/household/activity' : '/restaurant/donations';
  const textDialog = dialog && dialog in information ? information[dialog as keyof typeof information] : null;

  return <Screen navigation={<RoleProfileNavigation role={role} />}>
    <AppHeader title="Profile" variant="plain" showBack onBackPress={() => router.replace(`/${role}/dashboard` as Href)} />
    <ScrollView contentContainerStyle={[styles.content, role === 'ngo' && { paddingBottom: 110 }]} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={[Colors.gradientTop, Colors.gradientBottom]} style={styles.profileCard}>
        <Pressable accessibilityRole="button" accessibilityLabel="Edit profile photo" onPress={() => router.push(`/${role}/edit-profile` as Href)} style={styles.avatar}>
          {user?.avatar_url ? <Image source={{ uri: user.avatar_url }} style={styles.avatarImage} />
            : <Text style={styles.initials}>{name.trim().split(/\s+/).map((part) => part[0] ?? '').slice(0, 2).join('').toUpperCase()}</Text>}
        </Pressable>
        <Text style={styles.name}>{name || 'Your Profile'}</Text><Text style={styles.role}>{roleLabels[role]}</Text>
        <View style={styles.badge}><Text style={styles.badgeText}>Active Account</Text></View>
        <Text style={styles.role}>ID: {user?.id ?? '—'}</Text>
      </LinearGradient>
      {loading ? <ActivityIndicator color={Colors.primary} /> : null}
      {error ? <Card><Text accessibilityRole="alert" style={styles.error}>{error}</Text><SecondaryButton title="Retry" onPress={() => { if (profileController.current) loadProfile(profileController.current.signal); }} /></Card> : null}
      <Card><Text style={styles.cardTitle}>Personal Information</Text>
        <InfoRow label="Name" value={name} /><InfoRow label="Phone" value={user?.phone ?? ''} />
        <InfoRow label="Email" value={user?.email ?? ''} /><InfoRow label="Location" value={user?.location ?? ''} />
        <InfoRow label="Joined" value={user?.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'Unavailable'} />
      </Card>
      {role === 'volunteer' ? <Card><Text style={styles.cardTitle}>Pickup Preferences</Text>
        <InfoRow label="Preferred Area" value={pickupPreferences.preferredArea} />
        <InfoRow label="Preferred Time" value={`${pickupPreferences.preferredStartTime} – ${pickupPreferences.preferredEndTime}`} />
        <InfoRow label="Availability" value={isAvailable ? 'Available Today' : 'Not Available'} />
        <InfoRow label="Pickup Radius" value={pickupPreferences.pickupRadius} />
      </Card> : null}
      <Card><Text style={styles.cardTitle}>Statistics</Text><View style={styles.statsGrid}>{statLabels.map((label, index) =>
        <View key={label} style={styles.stat}><Text style={styles.statValue}>{statValues[index]}</Text><Text style={styles.statLabel}>{label}</Text></View>
      )}</View></Card>
      <Text style={styles.section}>Account &amp; Preferences</Text>
      <Card>
        <MenuRow label="Edit Profile" icon="user" onPress={() => router.push(`/${role}/edit-profile` as Href)} />
        <MenuRow label="Notification Preferences" icon="bell" onPress={() => role === 'volunteer' ? router.push('/volunteer/notification-preferences') : openDialog('notifications')} />
        {role === 'volunteer' ? <MenuRow label="Pickup Preferences" icon="package" onPress={() => router.push('/volunteer/pickup-preferences')} /> : null}
        <MenuRow label="Help & Support" icon="info" onPress={() => role === 'volunteer' ? router.push('/volunteer/help-support') : openDialog('support')} />
        <MenuRow label="Activity" icon="activity" onPress={() => router.push(activityRoute as Href)} />
        <MenuRow label="Delete Account" icon="trash" danger onPress={() => openDialog('delete')} />
      </Card>
      <Text style={styles.section}>More</Text>
      <Card>
        <MenuRow label="About App" icon="info" onPress={() => role === 'volunteer' ? router.push('/volunteer/about') : openDialog('about')} />
        <MenuRow label="Privacy" icon="user" onPress={() => role === 'volunteer' ? router.push('/volunteer/privacy') : openDialog('privacy')} />
        <MenuRow label="Terms" icon="check" onPress={() => role === 'volunteer' ? router.push('/volunteer/terms') : openDialog('terms')} />
      </Card>
      <PrimaryButton title="Log Out" onPress={() => openDialog('logout')} />
    </ScrollView>
    <Modal visible={dialog !== null} transparent animationType="fade" onRequestClose={closeDialog}>
      <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}><View style={styles.modal}>
        <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
          <Text accessibilityRole="header" style={styles.modalTitle}>{textDialog?.[0] ?? (dialog === 'delete' ? 'Delete Account' : dialog === 'logout' ? 'Log Out?' : dialog === 'support' ? 'Help & Support' : 'Notification Preferences')}</Text>
          {textDialog ? <Text style={styles.body}>{textDialog[1]}</Text> : null}
          {dialog === 'delete' ? <><Text style={styles.body}>Your personal profile and access will be removed. Completed donation records remain anonymized for other participants. Complete or cancel active donations and pickups first.</Text>
            <PasswordField label="Confirm your password" value={password} onChangeText={setPassword} />
            <PrimaryButton title="Delete My Account" style={{ backgroundColor: Colors.danger }} loading={saving} disabled={!password}
              onPress={() => void perform(() => deleteAccount(password), () => router.replace('/welcome'))} /></> : null}
          {dialog === 'logout' ? <><Text style={styles.body}>Are you sure you want to log out of your account?</Text>
            <PrimaryButton title="Confirm Log Out" loading={saving} onPress={() => void perform(() => logoutUser().catch(() => undefined), () => router.replace('/welcome'))} /></> : null}
          {dialog === 'notifications' ? <View style={styles.preferenceRow}><Text style={[styles.body, { flex: 1 }]}>Show notification popups</Text><Switch accessibilityLabel="Show notification popups"
            value={user?.notification_preferences?.generalNotifications !== false} disabled={saving}
            trackColor={{ false: Colors.border, true: Colors.primary }} thumbColor={Colors.white}
            onValueChange={(value) => void perform(() => setAccountNotifications(value))} /></View> : null}
          {dialog === 'support' ? <><Text style={styles.body}>Describe your account, donation, or collection issue. Your request will be saved for support.</Text>
            <FormField label="Your message" placeholder="Describe the issue (at least 10 characters)" value={supportMessage} onChangeText={setSupportMessage} multiline />
            <PrimaryButton title="Send Request" loading={saving} disabled={supportMessage.trim().length < 10} onPress={() => void perform(() => sendAccountSupportRequest(supportMessage.trim()), () => { setSupportMessage(''); setSuccess('Your support request has been saved.'); })} /></> : null}
          {success ? <Text style={styles.body}>{success}</Text> : null}
          {dialogError ? <Text accessibilityRole="alert" style={styles.error}>{dialogError}</Text> : null}
          <SecondaryButton title={textDialog || dialog === 'notifications' || dialog === 'support' ? 'Close' : 'Cancel'} disabled={saving} onPress={closeDialog} />
        </ScrollView>
      </View></KeyboardAvoidingView>
    </Modal>
  </Screen>;
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  profileCard: { borderRadius: 24, padding: 24, alignItems: 'center', gap: 10 },
  avatar: { width: 96, height: 96, borderRadius: 48, overflow: 'hidden', backgroundColor: Colors.primaryDark, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: Colors.white },
  avatarImage: { width: '100%', height: '100%' }, initials: { fontSize: 32, fontWeight: '800', color: Colors.white },
  name: { fontSize: 24, fontWeight: '800', color: Colors.white, textAlign: 'center' }, role: { color: Colors.white, fontSize: 13 },
  badge: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: Colors.primaryWash }, badgeText: { color: Colors.primaryDark, fontSize: 12, fontWeight: '700' },
  cardTitle: { fontSize: 17, fontWeight: '800', color: Colors.textPrimary, marginBottom: 10 },
  infoRow: { flexDirection: 'row', gap: 12, paddingVertical: 11, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
  label: { width: 76, color: Colors.textSecondary, fontSize: 13 }, value: { flex: 1, color: Colors.textPrimary, fontSize: 13, fontWeight: '600', textAlign: 'right' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, stat: { width: '48%', backgroundColor: Colors.primaryLight, padding: 14, borderRadius: 16, alignItems: 'center', gap: 6 },
  statValue: { color: Colors.primaryDark, fontSize: 25, fontWeight: '800' }, statLabel: { color: Colors.textSecondary, fontSize: 12, textAlign: 'center' },
  section: { color: Colors.textSecondary, fontSize: 13, fontWeight: '800', textTransform: 'uppercase', marginTop: 4 },
  menuRow: { flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
  menuIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.primaryWash, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, color: Colors.textPrimary, fontWeight: '600', fontSize: 14 },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: 'rgba(11,30,22,0.55)' },
  modal: { width: '100%', maxWidth: 420, maxHeight: '85%', backgroundColor: Colors.surface, borderRadius: 24 },
  modalContent: { padding: 20, gap: 16 }, modalTitle: { fontSize: 21, fontWeight: '800', color: Colors.textPrimary },
  body: { fontSize: 14, lineHeight: 22, color: Colors.textSecondary }, preferenceRow: { flexDirection: 'row', alignItems: 'center', gap: 16 }, error: { color: Colors.danger, fontSize: 13 },
});
