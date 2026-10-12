import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@/components/ui/Icon';
import { C, NgoFooter, NgoGradientButton, NgoLoadState, NgoPickupPreview, NgoTitleBar } from '@/components/ngo/NgoDesign';
import { useNgoDetail } from '@/hooks/useNgoDetail';
import { useNgoDonations } from '@/store/ngoDonations.store';
import { formatDateTime } from '@/utils/dateTime';
import { relativeTime } from '@/utils/ngoPresentation';
import { getDonationStatusLabel } from '@/utils/donation';

export default function DonationDetails() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { donation, loading, error } = useNgoDetail(id);
  const { reject, isSaving } = useNgoDonations();
  const [actionError, setActionError] = useState<string | null>(null);
  const decline = async () => {
    if (!donation || isSaving) return;
    try { await reject(donation.id); router.replace('/ngo/donations'); }
    catch { setActionError(useNgoDonations.getState().error); }
  };
  const available = donation?.status === 'published' && !donation.rejectedByCurrentNgo;
  return <View style={styles.root}><SafeAreaView edges={['top']} style={{ flex: 1 }}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
      <NgoTitleBar title="Donation Details" />
      <NgoLoadState loading={loading && !donation} error={actionError ?? error} />
      {donation ? <>
        <View style={styles.bannerWrap}><Image source={require('../../../assets/images/donation-banner.jpg')} style={styles.banner} resizeMode="cover" /></View>
        <View style={styles.titleRow}><View style={{ flex: 1 }}><Text style={styles.title}>{donation.foodType}</Text><View style={styles.postedRow}><Icon name="clock" size={12} color={C.muted} /><Text style={styles.posted}>Posted {relativeTime(donation.createdAt)}</Text></View></View><View style={styles.foodTag}><Text style={styles.foodTagText}>FOOD</Text></View></View>
        <View style={[styles.card, styles.infoCard]}>{[
          { icon: 'package' as const, label: 'Quantity', value: `${donation.quantity} ${donation.unit}` },
          { icon: 'map' as const, label: 'Location', value: donation.pickupLocation },
          { icon: 'clock' as const, label: 'Pickup by', value: formatDateTime(donation.pickupDeadline) },
        ].map((row, index) => <View key={row.label} style={[styles.infoRow, index < 2 && styles.infoDivider]}><View style={styles.infoIcon}><Icon name={row.icon} size={16} color={C.primaryDark} /></View><Text style={styles.infoLabel}>{row.label}</Text><Text style={styles.infoValue}>{row.value}</Text></View>)}</View>
        <View style={styles.section}><Text style={styles.sectionTitle}>Description</Text><Text style={styles.description}>{donation.description || 'No additional description provided.'}</Text></View>
        <NgoPickupPreview donation={donation} />
        {!available ? <Text style={[styles.description, { marginHorizontal: 20, marginTop: 16 }]}>{getDonationStatusLabel(donation.status)}{donation.volunteerName ? ` · Volunteer: ${donation.volunteerName}` : ''}</Text> : null}
      </> : !loading && !error ? <Text style={styles.notFound}>Donation not found</Text> : null}
    </ScrollView>
    {donation ? <NgoFooter>{available ? <View style={styles.actionRow}>
      <Pressable disabled={isSaving || loading} style={styles.rejectBtn} onPress={() => { void decline(); }}><Text style={styles.rejectText}>Reject</Text></Pressable>
      <View style={{ flex: 1 }}><NgoGradientButton title="Accept" disabled={isSaving || loading} onPress={() => router.push({ pathname: '/ngo/donationrequest', params: { id: donation.id } })} /></View>
    </View> : <NgoGradientButton title={donation.status === 'accepted' ? 'Assign Volunteer' : 'Track Collection'} onPress={() => router.push({ pathname: donation.status === 'accepted' ? '/ngo/assignvolunteer' : '/ngo/activecollection', params: { id: donation.id } })} />}</NgoFooter> : null}
  </SafeAreaView></View>;
}

const styles = StyleSheet.create({

  // =====================================================
  // ROOT
  // =====================================================

  root: {
    flex: 1,
    backgroundColor: C.bg,
  },

  center: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  notFound: {
    fontSize: 16,
    fontWeight: '700',
    color: C.text,
  },

  notFoundBtn: {
    backgroundColor: C.primary,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 12,
  },

  notFoundBtnText: {
    color: C.white,
    fontWeight: '700',
  },

  // =====================================================
  // TOP BAR
  // =====================================================

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backRow: {
    width: 90,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },

  topTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: C.text,
    textAlign: 'center',
  },

  backText: {
    fontSize: 13,
    fontWeight: '800',
    color: C.primary,
    letterSpacing: 0.5,
  },

  // =====================================================
  // BANNER
  // =====================================================

  bannerWrap: {
    marginHorizontal: 20,
    marginTop: 2,
    borderRadius: 18,
    overflow: 'hidden',
  },

  banner: {
    width: '100%',
    height: 132,
    borderRadius: 18,
  },

  // =====================================================
  // TITLE
  // =====================================================

  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 15,
    marginTop: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: C.text,
  },

  postedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },

  posted: {
    fontSize: 12,
    color: C.muted,
  },

  foodTag: {
    backgroundColor: C.tint,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 6,
  },

  foodTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: C.primaryDark,
    letterSpacing: 0.5,
  },

  // =====================================================
  // CARD
  // =====================================================

  card: {
    backgroundColor: C.card,
    borderRadius: 18,

    shadowColor: '#0B3D2A',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 3,
  },

  // =====================================================
  // INFO
  // =====================================================

  infoCard: {
    marginHorizontal: 10,
    marginTop: 16,
    paddingHorizontal: 14,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },

  infoDivider: {
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },

  infoIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: C.tint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  infoLabel: {
    flex: 1,
    fontSize: 13,
    color: C.muted,
  },

  infoValue: {
    maxWidth: '60%',
    fontSize: 13,
    fontWeight: '800',
    color: C.text,
    textAlign: 'right',
  },

  // =====================================================
  // DESCRIPTION
  // =====================================================

  section: {
    paddingHorizontal: 15,
    marginTop: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: C.text,
  },

  description: {
    fontSize: 13,
    lineHeight: 19,
    color: C.muted,
    marginTop: 6,
  },

  // =====================================================
  // MAP
  // =====================================================

  mapCard: {
    marginHorizontal: 16,
    marginTop: 14,
    overflow: 'hidden',
    height: 130,
  },

  mapBg: {
    flex: 1,
    backgroundColor: '#E4EEE8',
  },

  road: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },

  park: {
    position: 'absolute',
    backgroundColor: '#CFE6D6',
    borderRadius: 6,
  },

  pinWrap: {
    position: 'absolute',
    left: '50%',
    top: '52%',
    marginLeft: -14,
    marginTop: -14,
  },

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

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 3,
  },

  mapLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: C.text,
  },

  // =====================================================
  // BOTTOM ACTIONS
  // =====================================================

  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,

    backgroundColor: C.card,

    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,

    paddingHorizontal: 10,
    paddingTop: 12,

    shadowColor: '#0B3D2A',
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: -3,
    },

    elevation: 12,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },

  rejectBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,

    borderWidth: 1.5,
    borderColor: '#F0B4B6',

    backgroundColor: C.card,

    alignItems: 'center',
    justifyContent: 'center',
  },

  rejectText: {
    fontSize: 15,
    fontWeight: '800',
    color: C.red,
  },

  acceptBtn: {
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  acceptText: {
    fontSize: 15,
    fontWeight: '800',
    color: C.white,
  },
});