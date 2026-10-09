import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@/components/ui/Icon';
import { C, NgoFooter, NgoGradientButton, NgoLoadState, NgoPickupPreview, NgoTitleBar } from '@/components/ngo/NgoDesign';
import { useNgoDetail } from '@/hooks/useNgoDetail';
import { useNgoDonations } from '@/store/ngoDonations.store';
import { foodVisual, initials } from '@/utils/ngoPresentation';
import { formatDateTime } from '@/utils/dateTime';

export default function DonationRequest() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { donation, loading, error } = useNgoDetail(id);
  const { accept, reject, isSaving } = useNgoDonations();
  const [actionError, setActionError] = useState<string | null>(null);
  const handleAccept = async () => {
    if (!donation || isSaving) return;
    setActionError(null);
    try { await accept(donation.id); router.replace({ pathname: '/ngo/assignvolunteer', params: { id: donation.id } }); }
    catch { setActionError(useNgoDonations.getState().error); }
  };
  const handleReject = async () => {
    if (!donation || isSaving) return;
    setActionError(null);
    try { await reject(donation.id); router.replace('/ngo/donations'); }
    catch { setActionError(useNgoDonations.getState().error); }
  };
  return <View style={styles.root}><SafeAreaView edges={['top']} style={{ flex: 1 }}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 190 }}>
      <NgoTitleBar title="Donation Request" /><NgoLoadState loading={loading && !donation} error={actionError ?? error} />
      {donation ? <>
        <View style={[styles.card, styles.donorCard]}><LinearGradient colors={[C.gradientTop, C.gradientBottom]} style={styles.avatar}><Text style={styles.avatarText}>{initials(donation.donorName)}</Text></LinearGradient>
          <View style={{ flex: 1, marginLeft: 14 }}><View style={styles.nameRow}><Text style={styles.donorName}>{donation.donorName}</Text><View style={styles.verified}><Text style={styles.verifiedText}>{donation.donorRole === 'restaurant' ? 'RESTAURANT' : 'HOUSEHOLD'}</Text></View></View><View style={styles.contactRow}><Icon name="user" size={13} color={C.muted} /><Text style={styles.contactText}>{donation.donorRole === 'restaurant' ? 'Restaurant donor' : 'Household donor'}</Text></View><View style={styles.contactRow}><Icon name="pin" size={13} color={C.muted} /><Text style={[styles.contactText, { flex: 1 }]}>{donation.pickupLocation}</Text></View></View>
        </View>
        <Text style={styles.sectionTitle}>Item Details</Text><View style={[styles.card, styles.itemCard]}><View style={[styles.thumb, styles.thumbPlaceholder]}><Text style={{ fontSize: 44 }}>{foodVisual(donation.foodType).emoji}</Text></View><View style={{ flex: 1, marginLeft: 12 }}>{[
          { label: 'Item', value: donation.foodType }, { label: 'Quantity', value: `${donation.quantity} ${donation.unit}` }, { label: 'Pickup by', value: formatDateTime(donation.pickupDeadline) },
        ].map((row, index) => <View key={row.label} style={[styles.itemRow, index < 2 && styles.itemDivider]}><Text style={styles.itemLabel}>{row.label}</Text><Text style={styles.itemValue}>{row.value}</Text></View>)}</View></View>
        <Text style={styles.sectionTitle}>Message</Text><View style={styles.messageCard}><View style={styles.quoteCircle}><Text style={styles.quoteMark}>“</Text></View><Text style={styles.messageText}>{donation.description || 'No additional message provided.'}</Text></View>
        <NgoPickupPreview donation={donation} />
      </> : !loading && !error ? <Text style={styles.notFound}>Request not found</Text> : null}
    </ScrollView>
    {donation ? <NgoFooter>{donation.status === 'published' ? <>
      <NgoGradientButton title={isSaving ? 'Saving...' : 'Accept Donation'} disabled={loading || donation.rejectedByCurrentNgo} loading={isSaving} onPress={() => { void handleAccept(); }} />
      <Pressable disabled={loading || isSaving || donation.rejectedByCurrentNgo} style={styles.rejectBtn} onPress={() => { void handleReject(); }}><Text style={styles.rejectText}>Reject Donation</Text></Pressable>
    </> : <NgoGradientButton title={donation.status === 'accepted' ? 'Assign Volunteer' : 'Track Collection'} onPress={() => router.replace({ pathname: donation.status === 'accepted' ? '/ngo/assignvolunteer' : '/ngo/activecollection', params: { id: donation.id } })} />}</NgoFooter> : null}
  </SafeAreaView></View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  center: { alignItems: 'center', justifyContent: 'center', gap: 10 },
  notFound: { fontSize: 16, fontWeight: '700', color: C.text },
  notFoundBtn: { backgroundColor: C.primary, paddingHorizontal: 22, paddingVertical: 10, borderRadius: 12 },
  notFoundBtnText: { color: C.white, fontWeight: '700' },

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

  // Donor
  donorCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 4, padding: 14 },
  avatar: {
    width: 74,
    height: 74,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarText: { fontSize: 26, fontWeight: '800', color: C.white },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  donorName: { flexShrink: 1, fontSize: 18, fontWeight: '800', color: C.text },
  verified: { backgroundColor: C.tint, paddingHorizontal: 9, paddingVertical: 3, borderRadius: 9 },
  verifiedText: { fontSize: 9, fontWeight: '800', color: C.primaryDark, letterSpacing: 0.5 },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  contactIcon: { fontSize: 13, color: C.muted, width: 16 },
  contactText: { fontSize: 12, color: C.muted },

  // Sections
  sectionTitle: { fontSize: 16, fontWeight: '800', color: C.text, marginHorizontal: 20, marginTop: 20, marginBottom: 10 },

  // Item details
  itemCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, padding: 12 },
  thumb: { width: 92, height: 92, borderRadius: 16 },
  thumbPlaceholder: { backgroundColor: C.tint, alignItems: 'center', justifyContent: 'center' },
  itemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 9 },
  itemDivider: { borderBottomWidth: 1, borderBottomColor: C.border },
  itemLabel: { fontSize: 12, color: C.muted },
  itemValue: { fontSize: 13, fontWeight: '800', color: C.text, flexShrink: 1, marginLeft: 8 },

  // Message
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 16,
    backgroundColor: C.tint,
    borderRadius: 18,
    padding: 14,
  },
  quoteCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: C.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quoteMark: { fontSize: 24, fontWeight: '900', color: C.primaryDark, lineHeight: 30 },
  messageText: { flex: 1, fontSize: 13, lineHeight: 19, color: C.text },

  // Map
  mapCard: { marginHorizontal: 16, marginTop: 20, overflow: 'hidden', height: 130 },
  mapBg: { flex: 1, backgroundColor: '#E4EEE8' },
  road: { position: 'absolute', backgroundColor: '#FFFFFF' },
  park: { position: 'absolute', backgroundColor: '#CFE6D6', borderRadius: 6 },
  pinWrap: { position: 'absolute', left: '50%', top: '52%', marginLeft: -14, marginTop: -14 },
  pinOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(30,158,106,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: C.primary,
    borderWidth: 3,
    borderColor: C.white,
  },
  mapLabel: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: C.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    elevation: 3,
  },
  mapLabelText: { fontSize: 11, fontWeight: '700', color: C.text },

  // Bottom actions
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
  acceptBtn: { height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  acceptText: { fontSize: 15, fontWeight: '800', color: C.white },
  rejectBtn: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#F0B4B6',
    backgroundColor: C.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  rejectText: { fontSize: 15, fontWeight: '800', color: C.red },
});