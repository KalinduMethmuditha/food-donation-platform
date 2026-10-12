import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Icon, { type IconName } from '@/components/ui/Icon';
import type { NgoDonation } from '@/services/ngoDonations';
import { getDonationStatusLabel } from '@/utils/donation';
import { formatDateTime } from '@/utils/dateTime';

export const NgoColors = {
  primary: '#1E9E6A',
  primaryDark: '#14855A',
  gradientTop: '#2FB584',
  bg: '#F2F6F4',
  card: '#FFFFFF',
  border: '#E6ECE8',
  text: '#1B2B24',
  muted: '#63776D',
  tint: '#E3F4EA',
  white: '#FFFFFF',
  danger: '#C9363E',
} as const;

export function NgoHeader({ title, back = false, action }: {
  title: string;
  back?: boolean;
  action?: { icon: IconName; label: string; onPress: () => void };
}) {
  return (
    <LinearGradient colors={[NgoColors.gradientTop, NgoColors.primaryDark]} style={styles.header}>
      <SafeAreaView edges={['top']}>
        <View style={styles.headerRow}>
          {back ? (
            <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/ngo/donations' as any)} accessibilityRole="button" accessibilityLabel="Go back" style={styles.headerAction}>
              <Icon name="arrow-left" size={21} color={NgoColors.white} />
            </Pressable>
          ) : <View style={styles.headerAction} />}
          <Text style={styles.headerTitle}>{title}</Text>
          {action ? (
            <Pressable onPress={action.onPress} accessibilityRole="button" accessibilityLabel={action.label} style={styles.headerAction}>
              <Icon name={action.icon} size={21} color={NgoColors.white} />
            </Pressable>
          ) : <View style={styles.headerAction} />}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

export function NgoBottomNav({ active }: { active: 'home' | 'donations' | 'collections' | 'notifications' }) {
  const items: { id: typeof active; label: string; icon: IconName; route: string }[] = [
    { id: 'home', label: 'Home', icon: 'home', route: '/ngo/dashboard' },
    { id: 'donations', label: 'Donations', icon: 'package', route: '/ngo/donations' },
    { id: 'collections', label: 'Collections', icon: 'truck', route: '/ngo/activecollection' },
    { id: 'notifications', label: 'Notifications', icon: 'bell', route: '/ngo/notifications' },
  ];
  return (
    <SafeAreaView edges={['bottom']} style={styles.navSafe}>
      <View style={styles.nav}>
        {items.map((item) => (
          <Pressable key={item.id} onPress={() => router.replace(item.route as any)} accessibilityRole="button" accessibilityLabel={item.label} style={styles.navItem}>
            <View style={[styles.navIcon, active === item.id && styles.navIconActive]}>
              <Icon name={item.icon} size={20} color={active === item.id ? NgoColors.primaryDark : NgoColors.muted} />
            </View>
            <Text style={[styles.navText, active === item.id && styles.navTextActive]}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

export function NgoCard({ children }: PropsWithChildren) {
  return <View style={styles.card}>{children}</View>;
}

export function NgoAction({ label, onPress, disabled = false }: { label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityState={{ disabled }} style={[styles.button, disabled && styles.buttonDisabled]}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

export function NgoDonationCard({ donation, onPress }: { donation: NgoDonation; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={styles.donationCard}>
      <View style={styles.donationIcon}><Icon name="gift" size={24} color={NgoColors.primaryDark} /></View>
      <View style={styles.donationBody}>
        <Text style={styles.donationTitle}>{donation.foodType}</Text>
        <Text style={styles.donationMeta}>{donation.quantity} {donation.unit} · {donation.donorName} ({donation.donorRole})</Text>
        <Text style={styles.donationMeta}>{donation.pickupLocation}</Text>
        <Text style={styles.donationDeadline}>Pickup before {formatDateTime(donation.pickupDeadline)}</Text>
        <Text style={styles.donationStatus}>{getDonationStatusLabel(donation.status)}</Text>
      </View>
      <Icon name="chevron-right" size={18} color={NgoColors.primaryDark} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 18, borderBottomLeftRadius: 26, borderBottomRightRadius: 26 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 },
  headerAction: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: NgoColors.white, fontSize: 18, fontWeight: '800', textAlign: 'center', flex: 1 },
  navSafe: { backgroundColor: NgoColors.card, borderTopWidth: 1, borderTopColor: NgoColors.border },
  nav: { flexDirection: 'row', paddingTop: 7 },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 3 },
  navIcon: { width: 50, height: 31, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  navIconActive: { backgroundColor: NgoColors.tint },
  navText: { fontSize: 10, color: NgoColors.muted, marginTop: 3 },
  navTextActive: { fontWeight: '700', color: NgoColors.primaryDark },
  card: { backgroundColor: NgoColors.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: NgoColors.border },
  button: { minHeight: 50, borderRadius: 14, backgroundColor: NgoColors.primaryDark, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: NgoColors.white, fontSize: 15, fontWeight: '800' },
  donationCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: NgoColors.card, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: NgoColors.border },
  donationIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: NgoColors.tint },
  donationBody: { flex: 1, gap: 3 },
  donationTitle: { fontSize: 16, fontWeight: '800', color: NgoColors.text },
  donationMeta: { fontSize: 12, color: NgoColors.muted },
  donationDeadline: { fontSize: 12, color: NgoColors.text, marginTop: 3 },
  donationStatus: { fontSize: 12, fontWeight: '700', color: NgoColors.primaryDark, marginTop: 2 },
});
