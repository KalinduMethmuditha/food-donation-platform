import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@/components/ui/Icon';
import { donations } from '@/constants/donations';

// ---------- Colour palette (same as other screens) ----------
const C = {
  gradientTop: '#2FB584',
  gradientBottom: '#14855A',
  primary: '#1E9E6A',
  primaryDark: '#14855A',
  tint: '#E3F4EA',
  bg: '#F2F6F4',
  card: '#FFFFFF',
  border: '#E6ECE8',
  text: '#1B2B24',
  muted: '#8A9A93',
  busy: '#B5BFBA',
  white: '#FFFFFF',
};

type Volunteer = {
  id: string;
  name: string;
  status: 'Available' | 'Busy';
  distance: string;
  color: string; // avatar colour
};

// Mock data - replace with your API later
const volunteers: Volunteer[] = [
  { id: '1', name: 'Ayesha Perera', status: 'Available', distance: '1.2 km away', color: '#2FB584' },
  { id: '2', name: 'Ravi Kumar', status: 'Available', distance: '2.5 km away', color: '#3B82F6' },
  { id: '3', name: 'Nimal Silva', status: 'Busy', distance: '3.1 km away', color: '#9CA3AF' },
  { id: '4', name: 'Tharindu Fernando', status: 'Available', distance: '4.0 km away', color: '#F59E0B' },
];

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export default function AssignVolunteer() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const donation = donations.find((d) => d.id === id) ?? donations[0];

  const [selectedId, setSelectedId] = useState<string | null>('1');
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const selected = volunteers.find((v) => v.id === selectedId);

  const handleAssign = () => {
    if (!selected) return;
    // TODO: call your API here (assign `selected.id` to `donation.id`)
    setSuccess(true);
  };

  const handleDone = () => {
    setSuccess(false);
    router.dismissTo('/ngo/dashboard' as any);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 190 }}>
          {/* ================= TOP BAR ================= */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.backRow} onPress={() => router.back()} hitSlop={10}>
              <Text style={styles.backText}>‹ BACK</Text>
            </TouchableOpacity>
            <Text style={styles.topTitle}>Assign Volunteer</Text>
            <View style={styles.backRow} />
          </View>

          {/* ================= DONATION BANNER ================= */}
          <View style={styles.banner}>
            <View style={styles.bannerIcon}>
              <Text style={{ fontSize: 26 }}>{donation.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>
                {donation.title} · {donation.quantity}
              </Text>
              <Text style={styles.bannerSub}>Ready for volunteer pickup</Text>
            </View>
          </View>

          {/* ================= DROPDOWN ================= */}
          <Text style={styles.label}>Choose a volunteer</Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setOpen((o) => !o)}
            style={[styles.card, styles.dropdown, open && styles.dropdownOpen]}
          >
            <Icon name="user" size={18} color={C.muted} />
            <Text style={[styles.dropdownText, selected && { color: C.text, fontWeight: '700' }]}>
              {selected ? selected.name : 'Select Volunteer'}
            </Text>
            <Text style={styles.dropdownArrow}>{open ? '⌃' : '⌄'}</Text>
          </TouchableOpacity>

          {open && (
            <View style={[styles.card, styles.menu]}>
              {volunteers.map((v, i) => {
                const busy = v.status === 'Busy';
                const active = v.id === selectedId;
                return (
                  <TouchableOpacity
                    key={v.id}
                    disabled={busy}
                    activeOpacity={0.7}
                    onPress={() => {
                      setSelectedId(v.id);
                      setOpen(false);
                    }}
                    style={[styles.menuItem, i < volunteers.length - 1 && styles.menuDivider, active && styles.menuItemActive]}
                  >
                    <View style={[styles.menuDot, { backgroundColor: busy ? C.busy : C.primary }]} />
                    <Text style={[styles.menuText, busy && { color: C.muted }]}>{v.name}</Text>
                    <Text style={styles.menuStatus}>{busy ? 'Busy' : v.distance}</Text>
                    {active && <Text style={styles.menuCheck}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* ================= VOLUNTEER LIST ================= */}
          <View style={styles.list}>
            {volunteers.map((v) => {
              const busy = v.status === 'Busy';
              const active = v.id === selectedId;
              return (
                <TouchableOpacity
                  key={v.id}
                  disabled={busy}
                  activeOpacity={0.85}
                  onPress={() => setSelectedId(v.id)}
                  style={[styles.card, styles.item, active && styles.itemActive]}
                >
                  <View style={[styles.avatar, { backgroundColor: busy ? C.busy : v.color }]}>
                    <Text style={styles.avatarText}>{getInitials(v.name)}</Text>
                  </View>

                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.name, busy && styles.nameBusy]}>{v.name}</Text>
                    <View style={styles.metaRow}>
                      <View style={[styles.dot, { backgroundColor: busy ? C.busy : C.primary }]} />
                      <Text style={[styles.status, { color: busy ? C.muted : C.primary }]}>{v.status}</Text>
                      <Text style={styles.distance}>·  {v.distance}</Text>
                    </View>
                  </View>

                  <View style={[styles.radio, active && styles.radioActive, busy && styles.radioBusy]}>
                    {active && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* ================= BOTTOM BAR ================= */}
        <SafeAreaView edges={['bottom']} style={styles.actionBar}>
          <View style={styles.notice}>
            <Icon name="check-circle" size={16} color={C.primary} />
            <Text style={styles.noticeText}>The selected volunteer is notified instantly</Text>
          </View>

          <TouchableOpacity activeOpacity={0.85} disabled={!selected} onPress={handleAssign}>
            <LinearGradient
              colors={selected ? [C.gradientTop, C.gradientBottom] : ['#BFD8CC', '#A9C7B8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.assignBtn}
            >
              <Icon name="user" size={18} color={C.white} />
              <Text style={styles.assignText}>Assign Volunteer</Text>
            </LinearGradient>
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaView>
      {/* ================= SUCCESS MESSAGE ================= */}
      <Modal visible={success} transparent animationType="fade" onRequestClose={handleDone}>
        <View style={styles.overlay}>
          <View style={styles.successCard}>
            <LinearGradient colors={[C.gradientTop, C.gradientBottom]} style={styles.successCircle}>
              <Text style={styles.successTick}>✓</Text>
            </LinearGradient>

            <Text style={styles.successTitle}>Volunteer Assigned!</Text>
            <Text style={styles.successText}>
              {selected?.name} has been notified and will pick up {donation.title} ({donation.quantity}).
            </Text>

            <TouchableOpacity activeOpacity={0.85} style={{ alignSelf: 'stretch' }} onPress={handleDone}>
              <LinearGradient
                colors={[C.gradientTop, C.gradientBottom]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.successBtn}
              >
                <Text style={styles.successBtnText}>Back to Dashboard</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

  // Banner
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 4,
    backgroundColor: C.tint,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#CBE8D6',
  },
  bannerIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: C.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: { fontSize: 14, fontWeight: '800', color: C.text },
  bannerSub: { fontSize: 12, color: C.primaryDark, marginTop: 2 },

  // Dropdown
  label: { fontSize: 12, color: C.muted, marginHorizontal: 20, marginTop: 18, marginBottom: 8 },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    paddingHorizontal: 14,
    height: 50,
    borderRadius: 14,
  },
  dropdownOpen: { borderWidth: 1.5, borderColor: C.primary },
  menu: { marginHorizontal: 16, marginTop: 8, borderRadius: 14, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 13 },
  menuItemActive: { backgroundColor: C.tint },
  menuDivider: { borderBottomWidth: 1, borderBottomColor: C.border },
  menuDot: { width: 8, height: 8, borderRadius: 4 },
  menuText: { flex: 1, fontSize: 14, fontWeight: '700', color: C.text },
  menuStatus: { fontSize: 12, color: C.muted },
  menuCheck: { fontSize: 16, fontWeight: '900', color: C.primary },
  dropdownText: { flex: 1, fontSize: 14, color: C.muted },
  dropdownArrow: { fontSize: 20, color: C.text, marginTop: -6 },

  // List
  list: { paddingHorizontal: 16, marginTop: 16, gap: 12 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1.5, borderColor: 'transparent' },
  itemActive: { borderColor: C.primary },
  avatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontWeight: '800', color: C.white },
  name: { fontSize: 15, fontWeight: '800', color: C.text },
  nameBusy: { color: C.muted },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  status: { fontSize: 12, fontWeight: '700' },
  distance: { fontSize: 12, color: C.muted },

  // Radio
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CFD8D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: C.primary, backgroundColor: C.primary },
  radioBusy: { borderColor: '#E3E8E5' },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.white },

  // Bottom bar
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: C.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 14,
    shadowColor: '#0B3D2A',
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -3 },
    elevation: 12,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.tint,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 12,
  },
  noticeText: { fontSize: 12, fontWeight: '700', color: C.primaryDark, flex: 1 },
  assignBtn: {
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  assignText: { fontSize: 15, fontWeight: '800', color: C.white },

  // Success message
  overlay: { flex: 1, backgroundColor: 'rgba(11,30,22,0.55)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  successCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: C.card,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  successCircle: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  successTick: { fontSize: 36, fontWeight: '900', color: C.white, lineHeight: 42 },
  successTitle: { fontSize: 20, fontWeight: '800', color: C.text, marginTop: 16 },
  successText: { fontSize: 13, lineHeight: 20, color: C.muted, textAlign: 'center', marginTop: 8, marginBottom: 20 },
  successBtn: { height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  successBtnText: { fontSize: 15, fontWeight: '800', color: C.white },
});