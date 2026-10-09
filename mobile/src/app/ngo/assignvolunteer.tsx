import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@/components/ui/Icon';
import { C, NgoFooter, NgoGradientButton, NgoLoadState, NgoTitleBar } from '@/components/ngo/NgoDesign';
import { useNgoDonation, useNgoDonations } from '@/store/ngoDonations.store';
import { foodVisual, initials } from '@/utils/ngoPresentation';

export default function AssignVolunteer() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const donation = useNgoDonation(id);
  const { volunteers, loadDonation, loadVolunteers, assign, isSaving } = useNgoDonations();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useFocusEffect(useCallback(() => {
    let active = true;
    setLoading(true); setError(null);
    if (!id) { setLoading(false); setError('Donation not found.'); return; }
    void Promise.all([loadDonation(id), loadVolunteers()]).then(() => {
      if (active) setSelectedId(useNgoDonations.getState().volunteers[0]?.id ?? null);
    }).catch(() => { if (active) setError(useNgoDonations.getState().error ?? 'Could not load volunteers.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, loadDonation, loadVolunteers]));
  const selected = volunteers.find((item) => item.id === selectedId);
  const refreshVolunteers = async () => {
    setLoading(true); setError(null);
    try { await loadVolunteers(); } catch { setError(useNgoDonations.getState().error); }
    finally { setLoading(false); }
  };
  const handleAssign = async () => {
    if (!id || !selected || isSaving) return;
    setError(null);
    try { await assign(id, selected.id); setSuccess(true); }
    catch { setError(useNgoDonations.getState().error); void loadVolunteers().catch(() => undefined); }
  };
  const handleDone = () => { setSuccess(false); router.replace({ pathname: '/ngo/activecollection', params: { id } }); };
  const colors = [C.gradientTop, '#3B82F6', '#F59E0B', '#8B5CF6'];
  const canAssign = donation?.status === 'accepted';
  return <View style={styles.root}><SafeAreaView edges={['top']} style={{ flex: 1 }}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 200 }}>
      <NgoTitleBar title="Assign Volunteer" /><NgoLoadState loading={loading} error={error} />
      {donation ? <View style={styles.banner}><View style={styles.bannerIcon}><Text style={{ fontSize: 26 }}>{foodVisual(donation.foodType).emoji}</Text></View><View style={{ flex: 1 }}><Text style={styles.bannerTitle}>{donation.foodType} · {donation.quantity} {donation.unit}</Text><Text style={styles.bannerSub}>{canAssign ? 'Ready for volunteer pickup' : 'Volunteer assigned'}</Text></View></View> : null}
      {canAssign ? <>
        <Text style={styles.label}>Choose a volunteer</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Choose a volunteer" accessibilityState={{ expanded: open }} onPress={() => setOpen(!open)} style={[styles.card, styles.dropdown, open && styles.dropdownOpen]}><Icon name="user" size={18} color={C.muted} /><Text style={[styles.dropdownText, selected && { color: C.text, fontWeight: '700' }]}>{selected?.name ?? 'Select Volunteer'}</Text><Text style={styles.dropdownArrow}>{open ? '⌃' : '⌄'}</Text></Pressable>
        {open ? <View style={[styles.card, styles.menu]}>{volunteers.map((item, index) => <Pressable key={item.id} onPress={() => { setSelectedId(item.id); setOpen(false); }} style={[styles.menuItem, index < volunteers.length - 1 && styles.menuDivider, item.id === selectedId && styles.menuItemActive]}><View style={[styles.menuDot, { backgroundColor: C.primary }]} /><Text style={styles.menuText}>{item.name}</Text><Text style={styles.menuStatus}>Available</Text>{item.id === selectedId ? <Text style={styles.menuCheck}>✓</Text> : null}</Pressable>)}</View> : null}
        <View style={styles.list}>{volunteers.map((item, index) => <Pressable key={item.id} accessibilityRole="radio" accessibilityState={{ checked: item.id === selectedId }} onPress={() => setSelectedId(item.id)} style={[styles.card, styles.item, item.id === selectedId && styles.itemActive]}><View style={[styles.avatar, { backgroundColor: colors[index % colors.length] }]}><Text style={styles.avatarText}>{initials(item.name)}</Text></View><View style={{ flex: 1, marginLeft: 12 }}><Text style={styles.name}>{item.name}</Text><View style={styles.metaRow}><View style={[styles.dot, { backgroundColor: C.primary }]} /><Text style={[styles.status, { color: C.primary }]}>Available</Text></View></View><View style={[styles.radio, item.id === selectedId && styles.radioActive]}>{item.id === selectedId ? <View style={styles.radioDot} /> : null}</View></Pressable>)}{!loading && !error && volunteers.length === 0 ? <Text style={styles.distance}>No volunteers are available. Volunteers must turn on “Available for pickups” in their dashboard.</Text> : null}</View>
        <Pressable disabled={loading || isSaving} onPress={() => { void refreshVolunteers(); }} style={{ margin: 20 }}><Text style={[styles.status, { color: C.primaryDark }]}>Refresh volunteers</Text></Pressable>
      </> : donation && !success ? <Text style={[styles.distance, { margin: 20 }]}>This donation is already {donation.status}.</Text> : null}
    </ScrollView>
    {canAssign ? <NgoFooter><View style={styles.notice}><Icon name="check-circle" size={16} color={C.primary} /><Text style={styles.noticeText}>The assignment appears in the selected volunteer&apos;s pickups.</Text></View><NgoGradientButton title={isSaving ? 'Assigning...' : 'Assign Volunteer'} icon="user" disabled={!selected || loading} loading={isSaving} onPress={() => { void handleAssign(); }} /></NgoFooter> : null}
  </SafeAreaView>
  <Modal visible={success} transparent animationType="fade" onRequestClose={handleDone}><View style={styles.overlay}><View style={styles.successCard}><View style={[styles.successCircle, { backgroundColor: C.primary }]}><Text style={styles.successTick}>✓</Text></View><Text style={styles.successTitle}>Volunteer Assigned!</Text><Text style={styles.successText}>{selected?.name} will pick up {donation?.foodType} ({donation?.quantity} {donation?.unit}).</Text><View style={{ alignSelf: 'stretch' }}><NgoGradientButton title="Track Collection" onPress={handleDone} /></View></View></View></Modal>
  </View>;
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