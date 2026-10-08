import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Icon from '@/components/ui/Icon';
import { donations } from '@/constants/donations';

// ---------- Colour palette ----------
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
  redTint: '#FDE4E4',
  white: '#FFFFFF',
};

export default function DonationDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const donation = donations.find((d) => d.id === id);

  // If the id is wrong / missing
  if (!donation) {
    return (
      <SafeAreaView style={[styles.root, styles.center]}>
        <Text style={{ fontSize: 40 }}>🍽️</Text>

        <Text style={styles.notFound}>
          Donation not found
        </Text>

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.notFoundBtn}
        >
          <Text style={styles.notFoundBtnText}>
            Go back
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const infoRows = [
    {
      icon: 'package',
      label: 'Quantity',
      value: donation.quantity,
    },
    {
      icon: 'map',
      label: 'Location',
      value: donation.location,
    },
    {
      icon: 'clock',
      label: 'Pickup by',
      value: donation.pickupBy,
    },
  ];

  // Accept -> Donation Request page
  const handleAccept = () => {
    router.push({
      pathname: '/ngo/donationrequest' as any,
      params: {
        id: donation.id,
      },
    });
  };

  // Reject -> back to Available Donations page
  const handleReject = () => {
    router.dismissTo('/ngo/donations' as any);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView
        edges={['top']}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 150,
          }}
        >

          {/* ================= BACK ================= */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backRow}
              onPress={() => router.back()}
              hitSlop={10}
            >
              <Text style={styles.backText}>
                ‹ BACK
              </Text>
            </TouchableOpacity>

            <Text style={styles.topTitle}>
              Donation Details
            </Text>

            <View style={styles.backRow} />
          </View>

          {/* ================= BANNER ================= */}
          <View style={styles.bannerWrap}>
            <Image
              source={require('../../../assets/images/donation-banner.jpg')}
              style={styles.banner}
              resizeMode="cover"
            />
          </View>

          {/* ================= TITLE ================= */}
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>
                {donation.title}
              </Text>

              <View style={styles.postedRow}>
                <Icon
                  name="clock"
                  size={12}
                  color={C.muted}
                />

                <Text style={styles.posted}>
                  {donation.postedAgo}
                </Text>
              </View>
            </View>

            <View style={styles.foodTag}>
              <Text style={styles.foodTagText}>
                FOOD
              </Text>
            </View>
          </View>

          {/* ================= INFO CARD ================= */}
          <View style={[styles.card, styles.infoCard]}>
            {infoRows.map((r, i) => (
              <View
                key={r.label}
                style={[
                  styles.infoRow,
                  i < infoRows.length - 1 &&
                    styles.infoDivider,
                ]}
              >
                <View style={styles.infoIcon}>
                  <Icon
                    name={r.icon as any}
                    size={16}
                    color={C.primaryDark}
                  />
                </View>

                <Text style={styles.infoLabel}>
                  {r.label}
                </Text>

                <Text
                  style={styles.infoValue}
                  numberOfLines={1}
                >
                  {r.value}
                </Text>
              </View>
            ))}
          </View>

          {/* ================= DESCRIPTION ================= */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Description
            </Text>

            <Text style={styles.description}>
              {donation.description}
            </Text>
          </View>

          {/* ================= MAP PREVIEW ================= */}
          <View
            style={[
              styles.card,
              styles.mapCard,
            ]}
          >
            <View style={styles.mapBg}>

              {/* Roads */}
              <View
                style={[
                  styles.road,
                  {
                    top: 26,
                    left: 0,
                    right: 0,
                    height: 10,
                  },
                ]}
              />

              <View
                style={[
                  styles.road,
                  {
                    top: 70,
                    left: 0,
                    right: 0,
                    height: 8,
                  },
                ]}
              />

              <View
                style={[
                  styles.road,
                  {
                    left: 70,
                    top: 0,
                    bottom: 0,
                    width: 10,
                  },
                ]}
              />

              <View
                style={[
                  styles.road,
                  {
                    left: 190,
                    top: 0,
                    bottom: 0,
                    width: 8,
                  },
                ]}
              />

              {/* Parks */}
              <View
                style={[
                  styles.park,
                  {
                    top: 40,
                    left: 90,
                    width: 70,
                    height: 24,
                  },
                ]}
              />

              <View
                style={[
                  styles.park,
                  {
                    top: 84,
                    left: 210,
                    width: 60,
                    height: 20,
                  },
                ]}
              />

              {/* Pin */}
              <View style={styles.pinWrap}>
                <View style={styles.pinOuter}>
                  <View style={styles.pinInner} />
                </View>
              </View>
            </View>

            <View style={styles.mapLabel}>
              <Icon
                name="map"
                size={12}
                color={C.primaryDark}
              />

              <Text style={styles.mapLabelText}>
                Pickup · {donation.location}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* ================= BOTTOM ACTIONS ================= */}
        <SafeAreaView
          edges={['bottom']}
          style={styles.actionBar}
        >
          <View style={styles.actionRow}>

            {/* Reject */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.rejectBtn}
              onPress={handleReject}
            >
              <Text style={styles.rejectText}>
                Reject
              </Text>
            </TouchableOpacity>

            {/* Accept */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={{ flex: 1 }}
              onPress={handleAccept}
            >
              <LinearGradient
                colors={[
                  C.gradientTop,
                  C.gradientBottom,
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.acceptBtn}
              >
                <Text style={styles.acceptText}>
                  Accept
                </Text>
              </LinearGradient>
            </TouchableOpacity>

          </View>
        </SafeAreaView>
      </SafeAreaView>
    </View>
  );
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