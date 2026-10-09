import FoodThumbnail from '@/components/shared/FoodThumbnail';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@/components/ui/Icon';
import { C, NgoDesignNav, NgoFooter, NgoGradientButton, NgoLoadState, NgoPickupPreview, NgoTitleBar } from '@/components/ngo/NgoDesign';
import { useNgoDonation, useNgoDonations } from '@/store/ngoDonations.store';
import type { NgoDonation } from '@/services/ngoDonations';
import { initials } from '@/utils/ngoPresentation';
import { formatDateTime } from '@/utils/dateTime';
import { getDonationStatusLabel } from '@/utils/donation';

export default function ActiveCollection() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const donation = useNgoDonation(id);
  const { mine, refresh, loadDonation, error } = useNgoDonations();
  const [loading, setLoading] = useState(false);
  const refreshStatus = useCallback(async () => {
    setLoading(true);
    try { await refresh(); if (id) await loadDonation(id); }
    catch { /* The store exposes the API error. */ }
    finally { setLoading(false); }
  }, [id, refresh, loadDonation]);
  useFocusEffect(useCallback(() => { void refreshStatus(); }, [refreshStatus]));
  const stages = [
    { status: 'assigned', title: 'Assigned' }, { status: 'pickup', title: 'On the way' },
    { status: 'arrived', title: 'Arrived at pickup' }, { status: 'collected', title: 'Picked up / In transit' },
    { status: 'delivered', title: 'Completed' },
  ];
  const currentIndex = stages.findIndex((stage) => stage.status === donation?.status);
  const notes = donation?.statusLogs?.filter((log) => log.note) ?? [];
  const summary = (item: NgoDonation) => <View style={[styles.card, styles.summary]}>
    <View style={[styles.thumb, styles.thumbPlaceholder]}><FoodThumbnail food={item.foodType} /></View><View style={{ flex: 1, marginLeft: 12 }}><Text style={styles.summaryTitle}>{item.foodType} · {item.quantity} {item.unit}</Text><Text style={styles.summarySub}>Volunteer: {item.volunteerName ?? 'Awaiting assignment'}</Text>{!id ? <Text style={styles.summarySub}>{getDonationStatusLabel(item.status)}</Text> : null}</View>{item.volunteerName ? <View style={[styles.volAvatar, { backgroundColor: C.primary }]}><Text style={styles.volAvatarText}>{initials(item.volunteerName)}</Text></View> : <Icon name="chevron-right" size={18} color={C.primaryDark} />}
  </View>;
  return <View style={styles.root}><SafeAreaView edges={['top']} style={{ flex: 1 }}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
      <NgoTitleBar title={id ? 'Active Collection' : 'My Collections'} /><NgoLoadState loading={loading} error={error} retry={() => { void refreshStatus(); }} />
      {id ? donation ? <>
        {summary(donation)}<NgoPickupPreview donation={donation} />
        <View style={[styles.card, styles.progressCard]}><Text style={styles.progressTitle}>Collection Progress</Text>
          {stages.map((stage, index) => {
            const done = index < currentIndex || donation.status === 'delivered';
            const current = index === currentIndex && !done;
            const log = donation.statusLogs?.find((item) => item.status === stage.status);
            return <View key={stage.status} style={styles.stepRow}><View style={styles.indCol}><View style={[styles.circle, done ? styles.circleDone : current ? styles.circleCurrent : styles.circlePending]}>{done ? <Text style={styles.tick}>✓</Text> : current ? <View style={styles.currentDot} /> : null}</View>{index < stages.length - 1 ? <View style={[styles.line, done && styles.lineDone]} /> : null}</View><View style={styles.stepText}><Text style={[styles.stepTitle, !done && !current && { color: C.muted }]}>{stage.title}</Text><Text style={[styles.stepSub, current && { color: C.primary, fontWeight: '700' }]}>{log ? formatDateTime(log.createdAt) : current ? 'In progress' : done ? 'Completed' : 'Pending'}</Text></View></View>;
          })}
          {donation.status === 'accepted' ? <NgoGradientButton title="Assign Volunteer" onPress={() => router.push({ pathname: '/ngo/assignvolunteer', params: { id: donation.id } })} /> : null}
        </View>
        <Text style={styles.notesLabel}>Notes</Text><View style={[styles.card, styles.notesBox, { alignItems: 'flex-start', paddingVertical: 14 }]}><Icon name="info" size={16} color={C.muted} /><View style={{ flex: 1, gap: 10 }}>{notes.length ? notes.map((log) => <View key={log.id}><Text style={styles.summaryTitle}>{log.note}</Text><Text style={styles.summarySub}>{formatDateTime(log.createdAt)}</Text></View>) : <Text style={styles.summarySub}>No collection notes yet.</Text>}</View></View>
      </> : !loading && !error ? <Text style={[styles.summarySub, { margin: 20 }]}>Collection not found.</Text> : null : <>
        {['Active collections', 'Completed'].map((section) => {
          const items = mine.filter((item) => section === 'Completed' ? item.status === 'delivered' : !['delivered', 'cancelled'].includes(item.status));
          return <View key={section}><Text style={styles.notesLabel}>{section} ({items.length})</Text>{items.map((item) => <Pressable key={item.id} accessibilityRole="button" onPress={() => router.push({ pathname: '/ngo/activecollection', params: { id: item.id } })}>{summary(item)}</Pressable>)}{!loading && items.length === 0 ? <Text style={[styles.summarySub, { marginHorizontal: 20 }]}>No {section.toLowerCase()} yet.</Text> : null}</View>;
        })}
      </>}
    </ScrollView>
    {id ? <NgoFooter><Text style={[styles.summarySub, { marginBottom: 5, textAlign: 'center' }]}>The volunteer updates this collection&apos;s status.</Text><NgoGradientButton title="Refresh Status" icon="check" loading={loading} onPress={() => { void refreshStatus(); }} /></NgoFooter> : <NgoDesignNav active="collections" />}
  </SafeAreaView></View>;
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

  // Summary
  summary: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 4, padding: 12 },
  thumb: { width: 56, height: 56, borderRadius: 14 },
  thumbPlaceholder: { backgroundColor: C.tint, alignItems: 'center', justifyContent: 'center' },
  summaryTitle: { fontSize: 15, fontWeight: '800', color: C.text },
  summarySub: { fontSize: 12, color: C.muted, marginTop: 3 },
  volAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  volAvatarText: { fontSize: 13, fontWeight: '800', color: C.white },

  // Map
  mapCard: { marginHorizontal: 16, marginTop: 14, height: 150, overflow: 'hidden' },
  mapBg: { flex: 1, backgroundColor: '#E4EEE8' },
  road: { position: 'absolute', backgroundColor: '#FFFFFF' },
  water: { position: 'absolute', backgroundColor: '#CFE3EE', borderTopRightRadius: 30 },
  park: { position: 'absolute', backgroundColor: '#CFE6D6', borderRadius: 8 },
  routeSolidV: {
    position: 'absolute',
    left: '30%',
    top: 92,
    bottom: 0,
    width: 4,
    marginLeft: -2,
    backgroundColor: C.primaryDark,
    borderRadius: 2,
  },
  routeSolidH: {
    position: 'absolute',
    left: '30%',
    top: 88,
    width: '10%',
    height: 4,
    backgroundColor: C.primaryDark,
    borderRadius: 2,
  },
  dotsRow: {
    position: 'absolute',
    left: '42%',
    right: '16%',
    top: 88,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: C.primaryDark },
  arrowPos: { position: 'absolute', left: '40%', top: 90, marginLeft: -16, marginTop: -16 },
  arrowOuter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.white,
    borderWidth: 2.5,
    borderColor: C.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: { fontSize: 12, color: C.primaryDark },
  homePos: { position: 'absolute', right: '10%', top: 90, marginTop: -22 },
  homeOuter: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(30,158,106,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeInner: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: C.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeText: { fontSize: 14, color: C.white, lineHeight: 17 },
  eta: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: C.white,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    elevation: 3,
  },
  etaText: { fontSize: 12, fontWeight: '700', color: C.text },

  // Progress
  progressCard: { marginHorizontal: 16, marginTop: 14, padding: 16 },
  progressTitle: { fontSize: 16, fontWeight: '800', color: C.text, marginBottom: 14 },
  stepRow: { flexDirection: 'row', minHeight: 56 },
  indCol: { width: 28, alignItems: 'center' },
  circle: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  circleDone: { backgroundColor: C.primary },
  circleCurrent: { backgroundColor: C.white, borderWidth: 3, borderColor: C.primary },
  circlePending: { backgroundColor: C.white, borderWidth: 2, borderColor: C.pending },
  tick: { fontSize: 13, fontWeight: '900', color: C.white, lineHeight: 16 },
  currentDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.primary },
  line: { flex: 1, width: 3, backgroundColor: C.pending, marginVertical: 2, borderRadius: 2 },
  lineDone: { backgroundColor: C.primary },
  stepText: { marginLeft: 12, paddingTop: 1 },
  stepTitle: { fontSize: 15, fontWeight: '800', color: C.text },
  stepSub: { fontSize: 12, color: C.muted, marginTop: 2 },

  // Notes
  notesLabel: { fontSize: 15, fontWeight: '800', color: C.text, marginHorizontal: 20, marginTop: 18, marginBottom: 8 },
  notesBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    paddingHorizontal: 14,
    minHeight: 50,
    borderRadius: 14,
  },
  notesInput: { flex: 1, fontSize: 13, color: C.text, paddingVertical: 12, maxHeight: 90 },

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
    paddingTop: 16,
    shadowColor: '#0B3D2A',
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -3 },
    elevation: 12,
  },
  updateBtn: {
    height: 54,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 8,
  },
  updateTick: { fontSize: 16, fontWeight: '900', color: C.white },
  updateText: { fontSize: 15, fontWeight: '800', color: C.white },
});