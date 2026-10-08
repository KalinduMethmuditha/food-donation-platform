import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
  red: '#E5484D',
  white: '#FFFFFF',
};

export default function DonationRequest() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const donation = donations.find((d) => d.id === id);

  if (!donation) {
    return (
      <SafeAreaView style={[styles.root, styles.center]}>
        <Text style={{ fontSize: 40 }}>🍽️</Text>
        <Text style={styles.notFound}>Request not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.notFoundBtn}>
          <Text style={styles.notFoundBtnText}>Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const initials = donation.donorName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const itemRows = [
    { label: 'Item', value: donation.title },
    { label: 'Quantity', value: donation.quantity },
    { label: 'Pickup by', value: donation.pickupBy },
  ];

  // Accept -> Assign Volunteer page
  const handleAccept = () => {
    router.push({ pathname: '/ngo/assignvolunteer' as any, params: { id: donation.id } });
  };

  // Reject -> Available Donations page
  const handleReject = () => {
    router.dismissTo('/ngo/donations' as any);
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
            <Text style={styles.topTitle}>Donation Request</Text>
            <View style={styles.backRow} />
          </View>

          {/* ================= DONOR CARD ================= */}
          <View style={[styles.card, styles.donorCard]}>
            {donation.donorImage ? (
              <Image source={donation.donorImage} style={styles.avatar} />
            ) : (
              <LinearGradient colors={[C.gradientTop, C.gradientBottom]} style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </LinearGradient>
            )}

            <View style={{ flex: 1, marginLeft: 14 }}>
              <View style={styles.nameRow}>
                <Text style={styles.donorName} numberOfLines={1}>
                  {donation.donorName}
                </Text>
                <View style={styles.verified}>
                  <Text style={styles.verifiedText}>VERIFIED</Text>
                </View>
              </View>

              <View style={styles.contactRow}>
                <Text style={styles.contactIcon}>✉</Text>
                <Text style={styles.contactText}>{donation.donorEmail}</Text>
              </View>
              <View style={styles.contactRow}>
                <Text style={styles.contactIcon}>✆</Text>
                <Text style={styles.contactText}>{donation.donorPhone}</Text>
              </View>
            </View>
          </View>

          {/* ================= ITEM DETAILS ================= */}
          <Text style={styles.sectionTitle}>Item Details</Text>
          <View style={[styles.card, styles.itemCard]}>
            {donation.image ? (
              <Image source={donation.image} style={styles.thumb} />
            ) : (
              <View style={[styles.thumb, styles.thumbPlaceholder]}>
                <Text style={{ fontSize: 44 }}>{donation.emoji}</Text>
              </View>
            )}

            <View style={{ flex: 1, marginLeft: 12 }}>
              {itemRows.map((r, i) => (
                <View key={r.label} style={[styles.itemRow, i < itemRows.length - 1 && styles.itemDivider]}>
                  <Text style={styles.itemLabel}>{r.label}</Text>
                  <Text style={styles.itemValue} numberOfLines={1}>
                    {r.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* ================= MESSAGE ================= */}
          <Text style={styles.sectionTitle}>Message</Text>
          <View style={styles.messageCard}>
            <View style={styles.quoteCircle}>
              <Text style={styles.quoteMark}>“</Text>
            </View>
            <Text style={styles.messageText}>{donation.message}</Text>
          </View>

          {/* ================= MAP PREVIEW ================= */}
          <View style={[styles.card, styles.mapCard]}>
            <View style={styles.mapBg}>
              {/* roads */}
              <View style={[styles.road, { top: 26, left: 0, right: 0, height: 10 }]} />
              <View style={[styles.road, { top: 70, left: 0, right: 0, height: 8 }]} />
              <View style={[styles.road, { left: 70, top: 0, bottom: 0, width: 10 }]} />
              <View style={[styles.road, { left: 190, top: 0, bottom: 0, width: 8 }]} />
              {/* parks */}
              <View style={[styles.park, { top: 40, left: 90, width: 70, height: 24 }]} />
              <View style={[styles.park, { top: 84, left: 210, width: 60, height: 20 }]} />

              {/* pin */}
              <View style={styles.pinWrap}>
                <View style={styles.pinOuter}>
                  <View style={styles.pinInner} />
                </View>
              </View>
            </View>

            <View style={styles.mapLabel}>
              <Icon name="map" size={12} color={C.primaryDark} />
              <Text style={styles.mapLabelText}>Pickup · {donation.location}</Text>
            </View>
          </View>
        </ScrollView>

        {/* ================= BOTTOM ACTIONS ================= */}
        <SafeAreaView edges={['bottom']} style={styles.actionBar}>
          <TouchableOpacity activeOpacity={0.85} onPress={handleAccept}>
            <LinearGradient
              colors={[C.gradientTop, C.gradientBottom]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.acceptBtn}
            >
              <Text style={styles.acceptText}>Accept Donation</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} style={styles.rejectBtn} onPress={handleReject}>
            <Text style={styles.rejectText}>Reject Donation</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaView>
    </View>
  );
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