import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Linking, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import { mockActivePickup } from '@/data/mockVolunteerData';
import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';
import { useVolunteerStore } from '@/store/volunteerStore';

export default function RouteScreen() {
  const pickup = mockActivePickup;
  const { pickupStatus, setPickupStatus } = useVolunteerStore();

  const handleOpenMap = () => {
    // Attempt to open external map for directions
    const url = `https://maps.google.com/?q=${encodeURIComponent(pickup.address)}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', 'No maps application found on this device.');
      }
    });
  };

  const handleArrived = () => {
    if (pickupStatus === 'ON THE WAY' || pickupStatus === 'ASSIGNED') {
      setPickupStatus('ARRIVED');
    }
    router.replace('/volunteer/collection-status');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <VolunteerScreenHeader title="Route to Pickup" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} bounces={false}>

        {/* ─── REAL MAP (WEB) OR MOCK MAP (NATIVE) ─── */}
        <View style={styles.mapContainer}>
          {Platform.OS === 'web' ? (
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=79.82%2C6.91%2C79.88%2C6.95&layer=mapnik&marker=6.93%2C79.85"
              width="100%"
              height="100%"
              style={{ border: 0 }}
            />
          ) : (
            <>
              <View style={styles.mapOverlay} />
              {/* Simulated Route Line */}
              <View style={styles.routeLine} />
              {/* Origin Pulse */}
              <View style={styles.originMarker}>
                <View style={styles.originPulse} />
                <View style={styles.originDot} />
              </View>
              {/* Destination Pin */}
              <View style={styles.destMarker}>
                <Icon name="pin" size={32} color={Colors.primaryDark} />
              </View>
            </>
          )}
          
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        {/* ─── TRACKING CARD ─── */}
        <View style={styles.bottomCard}>
          <Text style={styles.cardTitle}>Live Route Tracking</Text>
          
          <View style={styles.destRow}>
            <View style={styles.destIconBox}>
              <Icon name="building" size={20} color={Colors.primaryDark} />
            </View>
            <View style={styles.destInfo}>
              <Text style={styles.destLabel}>Pickup From</Text>
              <Text style={styles.destName}>{pickup.donor}</Text>
              <Text style={styles.destAddress}>{pickup.address}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{pickupStatus}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statusRow}>
            <View style={styles.currentBox}>
              <Text style={styles.currentLabel}>Current Status</Text>
              <Text style={styles.currentValue}>
                {pickupStatus === 'ARRIVED' ? 'Arrived at pickup location' : 'On the way to pickup location'}
              </Text>
            </View>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Distance</Text>
              <Text style={styles.metricValue}>{pickup.distance}</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Estimated Time</Text>
              <Text style={styles.metricValue}>{pickup.estimatedTime}</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.outlineBtn} onPress={handleOpenMap}>
              <Icon name="map" size={18} color={Colors.primaryDark} />
              <Text style={styles.outlineBtnText}>Open Map</Text>
            </TouchableOpacity>

            {pickupStatus !== 'ARRIVED' && pickupStatus !== 'COLLECTED' && pickupStatus !== 'DELIVERED' && (
              <TouchableOpacity style={styles.primaryBtn} onPress={handleArrived}>
                <Text style={styles.primaryBtnText}>Arrived</Text>
              </TouchableOpacity>
            )}
            
            {(pickupStatus === 'ARRIVED' || pickupStatus === 'COLLECTED' || pickupStatus === 'DELIVERED') && (
              <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/volunteer/collection-status')}>
                <Text style={styles.primaryBtnText}>View Status</Text>
              </TouchableOpacity>
            )}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { flexGrow: 1 },

  // Mock Map
  mapContainer: {
    height: 320,
    backgroundColor: '#E5E7EB', // Gray map background
    position: 'relative',
    overflow: 'hidden',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.4)',
    // Grid pattern simulation
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  routeLine: {
    position: 'absolute',
    top: '30%',
    left: '20%',
    width: '60%',
    height: '40%',
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: Colors.primary,
    borderBottomLeftRadius: 20,
  },
  originMarker: {
    position: 'absolute',
    bottom: '25%',
    left: '15%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  originPulse: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    opacity: 0.2,
    position: 'absolute',
  },
  originDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.primaryDark,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  destMarker: {
    position: 'absolute',
    top: '20%',
    right: '15%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  liveBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.danger,
  },
  liveText: { fontSize: 11, fontWeight: '800', color: Colors.textPrimary },

  // Bottom Card
  bottomCard: {
    flex: 1,
    marginTop: -24,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
    gap: 16,
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
  
  destRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  destIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primaryWash,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destInfo: { flex: 1, gap: 2 },
  destLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '600', textTransform: 'uppercase' },
  destName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  destAddress: { fontSize: 13, color: Colors.textSecondary },
  statusBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: { fontSize: 10, fontWeight: '800', color: Colors.primaryDark },

  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 4 },

  statusRow: { backgroundColor: Colors.background, borderRadius: 12, padding: 16 },
  currentBox: { gap: 4 },
  currentLabel: { fontSize: 12, color: Colors.textMuted },
  currentValue: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },

  metricsRow: { flexDirection: 'row', alignItems: 'center' },
  metricBox: { flex: 1, gap: 4 },
  metricDivider: { width: 1, height: 32, backgroundColor: Colors.border, marginHorizontal: 16 },
  metricLabel: { fontSize: 12, color: Colors.textMuted },
  metricValue: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },

  actions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  outlineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 14,
  },
  outlineBtnText: { fontSize: 14, fontWeight: '600', color: Colors.primaryDark },
  primaryBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryDark,
    borderRadius: 12,
    paddingVertical: 14,
  },
  primaryBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
});
