import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon, { type IconName } from '@/components/ui/Icon';
import type { NgoDonation } from '@/services/ngoDonations';

export const C = {
  gradientTop: '#2FB584', gradientBottom: '#14855A', primary: '#1E9E6A', primaryDark: '#14855A',
  tint: '#E3F4EA', redTint: '#FDE4E4', red: '#E5484D', bg: '#F2F6F4', card: '#FFFFFF',
  border: '#E6ECE8', text: '#1B2B24', muted: '#8A9A93', white: '#FFFFFF', pending: '#C9D3CE',
  busy: '#B5BFBA', unreadBg: '#DFF2E7', unreadBorder: '#BFE3CF',
};

export function NgoTitleBar({ title }: { title: string }) {
  return <View style={styles.topBar}>
    <Pressable accessibilityRole="button" accessibilityLabel="Go back" hitSlop={10} style={styles.backRow}
      onPress={() => router.canGoBack() ? router.back() : router.replace('/ngo/dashboard')}>
      <Text style={styles.backText}>‹ BACK</Text>
    </Pressable>
    <Text style={styles.topTitle}>{title}</Text><View style={styles.backRow} />
  </View>;
}

export function NgoGradientButton({ title, onPress, disabled = false, loading = false, icon }: {
  title: string; onPress: () => void; disabled?: boolean; loading?: boolean; icon?: IconName;
}) {
  return <Pressable onPress={onPress} disabled={disabled || loading} accessibilityRole="button"
    accessibilityState={{ disabled: disabled || loading }} style={{ opacity: disabled ? 0.5 : 1 }}>
    <LinearGradient colors={[C.gradientTop, C.gradientBottom]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.button}>
      {loading ? <ActivityIndicator color={C.white} /> : icon ? <Icon name={icon} size={18} color={C.white} /> : null}
      <Text style={styles.buttonText}>{title}</Text>
    </LinearGradient>
  </Pressable>;
}

export function NgoFooter({ children }: { children: ReactNode }) {
  return <SafeAreaView edges={['bottom']} style={styles.footer}>{children}</SafeAreaView>;
}

export function NgoDesignNav({ active }: { active: 'home' | 'donations' | 'collections' | 'notifications' }) {
  const items: { id: typeof active; label: string; icon: IconName; route: '/ngo/dashboard' | '/ngo/donations' | '/ngo/activecollection' | '/ngo/notifications' }[] = [
    { id: 'home', label: 'Home', icon: 'home', route: '/ngo/dashboard' },
    { id: 'donations', label: 'Donations', icon: 'package', route: '/ngo/donations' },
    { id: 'collections', label: 'Collections', icon: 'truck', route: '/ngo/activecollection' },
    { id: 'notifications', label: 'Notifications', icon: 'bell', route: '/ngo/notifications' },
  ];
  return <SafeAreaView edges={['bottom']} style={styles.navWrap}><View style={styles.nav}>
    {items.map((item) => <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={item.label}
      accessibilityState={{ selected: active === item.id }} onPress={() => router.replace(item.route)} style={styles.navItem}>
      <View style={[styles.navIcon, active === item.id && styles.navIconActive]}><Icon name={item.icon} size={20} color={active === item.id ? C.primaryDark : C.muted} /></View>
      <Text style={[styles.navLabel, active === item.id && styles.navLabelActive]}>{item.label}</Text>
    </Pressable>)}
  </View></SafeAreaView>;
}

export function NgoLoadState({ loading, error, retry }: { loading: boolean; error: string | null; retry?: () => void }) {
  return <>{loading ? <ActivityIndicator style={styles.message} color={C.primary} /> : null}
    {error ? <View style={styles.message}><Text accessibilityRole="alert" style={styles.error}>{error}</Text>
      {retry ? <Pressable accessibilityRole="button" onPress={retry}><Text style={styles.retry}>Try again</Text></Pressable> : null}
    </View> : null}</>;
}

export function NgoPickupPreview({ donation }: { donation: NgoDonation }) {
  const coordinates = donation.pickupLatitude !== undefined && donation.pickupLongitude !== undefined
    ? `${donation.pickupLatitude},${donation.pickupLongitude}` : donation.pickupLocation;
  return <Pressable accessibilityRole="link" accessibilityLabel={`Open pickup map for ${donation.pickupLocation}`}
    onPress={() => { void Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coordinates)}`); }} style={styles.mapCard}>
    <View accessible={false} aria-hidden style={styles.mapBg}>
      <View style={[styles.road, { top: 26, left: 0, right: 0, height: 10 }]} />
      <View style={[styles.road, { top: 70, left: 0, right: 0, height: 8 }]} />
      <View style={[styles.road, { left: '25%', top: 0, bottom: 0, width: 10 }]} />
      <View style={[styles.road, { left: '70%', top: 0, bottom: 0, width: 8 }]} />
      <View style={[styles.park, { top: 40, left: '34%', width: 70, height: 24 }]} />
      <View style={[styles.park, { top: 84, left: '75%', width: 60, height: 20 }]} />
      <View style={styles.pinOuter}><View style={styles.pinInner} /></View>
    </View>
    <View style={styles.mapLabel}><Icon name="map" size={12} color={C.primaryDark} /><Text numberOfLines={1} style={styles.mapLabelText}>Pickup · {donation.pickupLocation}</Text></View>
    <Text style={styles.openMap}>Open map ↗</Text>
  </Pressable>;
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 48 },
  backRow: { width: 82, paddingHorizontal: 16, paddingVertical: 14 },
  backText: { color: C.primary, fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  topTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '800', color: C.text },
  button: { height: 52, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  buttonText: { color: C.white, fontSize: 15, fontWeight: '800' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: C.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8, gap: 10, boxShadow: '0 -3px 14px rgba(11,61,42,0.1)' },
  navWrap: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 12 },
  nav: { flexDirection: 'row', backgroundColor: C.card, borderRadius: 26, paddingVertical: 8, marginBottom: 6, boxShadow: '0 -2px 14px rgba(11,61,42,0.12)' },
  navItem: { flex: 1, alignItems: 'center' },
  navIcon: { width: 50, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  navIconActive: { backgroundColor: C.tint },
  navLabel: { fontSize: 10, fontWeight: '600', color: C.muted, marginTop: 3 }, navLabelActive: { color: C.primaryDark },
  message: { margin: 16, gap: 8 }, error: { color: C.red, fontSize: 13 }, retry: { color: C.primaryDark, fontWeight: '700' },
  mapCard: { marginHorizontal: 16, marginTop: 14, height: 150, borderRadius: 18, overflow: 'hidden', backgroundColor: '#E4EEE8' },
  mapBg: { flex: 1 }, road: { position: 'absolute', backgroundColor: C.white }, park: { position: 'absolute', backgroundColor: '#CFE6D6', borderRadius: 6 },
  pinOuter: { position: 'absolute', left: '50%', top: '52%', marginLeft: -14, marginTop: -14, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(30,158,106,0.25)', alignItems: 'center', justifyContent: 'center' },
  pinInner: { width: 14, height: 14, borderRadius: 7, backgroundColor: C.primary, borderWidth: 3, borderColor: C.white },
  mapLabel: { position: 'absolute', top: 10, left: 10, right: 10, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.white, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14 },
  mapLabelText: { flex: 1, color: C.text, fontSize: 11, fontWeight: '700' }, openMap: { position: 'absolute', bottom: 10, right: 12, color: C.primaryDark, fontWeight: '700', fontSize: 11, backgroundColor: C.white, padding: 5, borderRadius: 8 },
});
