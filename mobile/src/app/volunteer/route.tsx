import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import { mockActivePickup } from '@/data/mockVolunteerData';
import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';

/** A purely local mock map visual — no external API required. */
function MockMapView() {
  return (
    <View style={map.container}>
      {/* Grid background */}
      <View style={map.grid}>
        {Array.from({ length: 6 }).map((_, r) => (
          <View key={r} style={map.gridRow}>
            {Array.from({ length: 5 }).map((_, c) => (
              <View key={c} style={map.gridCell} />
            ))}
          </View>
        ))}
      </View>

      {/* Roads (horizontal) */}
      <View style={[map.road, map.roadH1]} />
      <View style={[map.road, map.roadH2]} />
      <View style={[map.road, map.roadH3]} />

      {/* Roads (vertical) */}
      <View style={[map.road, map.roadV1]} />
      <View style={[map.road, map.roadV2]} />

      {/* Route line (SVG-like diagonal path using absolute positioned views) */}
      <View style={map.routeSegment1} />
      <View style={map.routeSegment2} />
      <View style={map.routeSegment3} />

      {/* Origin marker (current location) */}
      <View style={map.originMarker}>
        <View style={map.originPulse} />
        <View style={map.originDot} />
      </View>

      {/* Destination marker */}
      <View style={map.destMarker}>
        <Icon name="pin" size={28} color={Colors.primaryDark} />
      </View>

      {/* LIVE badge */}
      <View style={map.liveBadge}>
        <View style={map.liveDot} />
        <Text style={map.liveText}>LIVE</Text>
      </View>
    </View>
  );
}

export default function RouteScreen() {
  const pickup = mockActivePickup;

  const handleOpenMap = () => {
    Alert.alert(
      'Open Map',
      'This would open your maps application with turn-by-turn navigation.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <VolunteerScreenHeader title="Route to Pickup" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ─── MOCK MAP ─── */}
        <MockMapView />

        {/* ─── LIVE ROUTE TRACKING CARD ─── */}
        <View style={styles.trackingCard}>
          <View style={styles.trackingTop}>
            <View>
              <Text style={styles.trackingLabel}>Pickup From</Text>
              <Text style={styles.trackingDonor}>{pickup.donor}</Text>
              <View style={styles.addrRow}>
                <Icon name="pin" size={13} color={Colors.textSecondary} />
                <Text style={styles.addrText}>{pickup.address}</Text>
              </View>
            </View>
            <View style={styles.onWayBadge}>
              <Text style={styles.onWayText}>ON THE WAY</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.currentStatusLabel}>Current Status</Text>
          <Text style={styles.currentStatus}>On the way to pickup location</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>DISTANCE</Text>
              <Text style={styles.statValue}>{pickup.distance}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>ESTIMATED TIME</Text>
              <Text style={styles.statValue}>{pickup.estimatedTime}</Text>
            </View>
          </View>
        </View>

        {/* ─── BUTTONS ─── */}
        <View style={styles.btnRow}>
          <TouchableOpacity
            onPress={handleOpenMap}
            style={styles.outlineBtn}
            accessibilityRole="button"
            accessibilityLabel="Open Map"
          >
            <Icon name="map" size={17} color={Colors.primaryDark} />
            <Text style={styles.outlineBtnText}>Open Map</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/volunteer/collection-status')}
            style={styles.arrivedBtn}
            accessibilityRole="button"
            accessibilityLabel="Arrived at pickup location"
          >
            <Icon name="check-circle" size={17} color={Colors.white} />
            <Text style={styles.arrivedBtnText}>Arrived</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ── Mock Map Styles ──────────────────────────────────────────────────
const map = StyleSheet.create({
  container: {
    height: 220,
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  grid: { flex: 1 },
  gridRow: { flex: 1, flexDirection: 'row' },
  gridCell: {
    flex: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(16,185,129,0.10)',
  },
  road: { position: 'absolute', backgroundColor: '#fff' },
  roadH1: { left: 0, right: 0, top: '33%', height: 8, opacity: 0.8 },
  roadH2: { left: 0, right: 0, top: '60%', height: 6, opacity: 0.7 },
  roadH3: { left: 0, right: 0, top: '80%', height: 5, opacity: 0.6 },
  roadV1: { top: 0, bottom: 0, left: '35%', width: 7, opacity: 0.8 },
  roadV2: { top: 0, bottom: 0, left: '65%', width: 6, opacity: 0.7 },

  routeSegment1: {
    position: 'absolute',
    left: '22%',
    top: '60%',
    width: '14%',
    height: 4,
    backgroundColor: Colors.primaryDark,
    borderRadius: 2,
  },
  routeSegment2: {
    position: 'absolute',
    left: '35%',
    top: '33%',
    width: 4,
    height: '27%',
    backgroundColor: Colors.primaryDark,
    borderRadius: 2,
  },
  routeSegment3: {
    position: 'absolute',
    left: '35%',
    top: '18%',
    width: '30%',
    height: 4,
    backgroundColor: Colors.primaryDark,
    borderRadius: 2,
  },

  originMarker: {
    position: 'absolute',
    left: '18%',
    top: '52%',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  originPulse: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(16,185,129,0.20)',
  },
  originDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.white,
  },

  destMarker: {
    position: 'absolute',
    left: '60%',
    top: '8%',
  },

  liveBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 3,
    elevation: 2,
  },
  liveDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: Colors.danger },
  liveText: { fontSize: 11, fontWeight: '800', color: Colors.textPrimary, letterSpacing: 0.5 },
});

// ── Screen Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, gap: 14, paddingBottom: 32 },

  trackingCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 10,
  },
  trackingTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  trackingLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  trackingDonor: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginTop: 2 },
  addrRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  addrText: { fontSize: 12, color: Colors.textSecondary },
  onWayBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  onWayText: { fontSize: 10, fontWeight: '700', color: Colors.primaryDark, letterSpacing: 0.5 },
  divider: { height: 1, backgroundColor: Colors.border },
  currentStatusLabel: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  currentStatus: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statBox: { flex: 1, gap: 3 },
  statLabel: { fontSize: 10, fontWeight: '600', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  statValue: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  statDivider: { width: 1, height: 40, backgroundColor: Colors.border, marginHorizontal: 16 },

  btnRow: { flexDirection: 'row', gap: 10 },
  outlineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  outlineBtnText: { fontSize: 14, fontWeight: '600', color: Colors.primaryDark },
  arrivedBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.primaryDark,
  },
  arrivedBtnText: { fontSize: 14, fontWeight: '700', color: Colors.white },
});
