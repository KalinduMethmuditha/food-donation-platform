import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Linking, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import { mockActivePickup } from '@/data/mockVolunteerData';
import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';
import { useVolunteerStore } from '@/store/volunteerStore';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

// Conditionally import MapView to avoid crashing on unsupported environments
let MapView: any = null;
let Marker: any = null;
let Polyline: any = null;
try {
  if (Platform.OS !== 'web') {
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    Marker = Maps.Marker;
    Polyline = Maps.Polyline;
  }
} catch (e) {
  // Map not available
}

export default function RouteScreen() {
  const pickup = mockActivePickup;
  const { setPickupStatus, pickupStatus } = useVolunteerStore();
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  
  // Destination coordinates (mock for Negombo)
  const destinationCoords = { latitude: 7.2088, longitude: 79.8362 };

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'web') return;
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          // Fallback location if permission denied
          setCurrentLocation({ latitude: 7.2000, longitude: 79.8400 });
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        // Fallback location if error
        setCurrentLocation({ latitude: 7.2000, longitude: 79.8400 });
      }
    })();
  }, []);

  const handleOpenMap = () => {
    const url = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(pickup.address)}`,
      android: `geo:0,0?q=${encodeURIComponent(pickup.address)}`,
      web: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pickup.address)}`,
      default: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pickup.address)}`,
    });
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Map Unavailable', 'Could not open the map application.');
      }
    });
  };

  const handleArrived = () => {
    setPickupStatus('ARRIVED');
    router.push('/volunteer/collection-status');
  };

  const isMapSupported = MapView && Platform.OS !== 'web';
  const fallbackLocation = currentLocation || { latitude: 7.2000, longitude: 79.8400 };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <VolunteerScreenHeader title="Route to Pickup" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ─── MAP SECTION ─── */}
        <View style={styles.mapContainer}>
          {isMapSupported ? (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: (fallbackLocation.latitude + destinationCoords.latitude) / 2,
                longitude: (fallbackLocation.longitude + destinationCoords.longitude) / 2,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              showsUserLocation={true}
            >
              <Marker
                coordinate={fallbackLocation}
                title="You"
                pinColor={Colors.primary}
              />
              <Marker
                coordinate={destinationCoords}
                title={pickup.donor}
                description={pickup.address}
                pinColor={Colors.danger}
              />
              <Polyline
                coordinates={[fallbackLocation, destinationCoords]}
                strokeColor={Colors.primaryDark}
                strokeWidth={3}
                lineDashPattern={[5, 5]}
              />
            </MapView>
          ) : (
            <View style={styles.mockMap}>
              <Icon name="map" size={40} color={Colors.primaryLight} />
              <Text style={styles.mockMapText}>Interactive map available on mobile</Text>
            </View>
          )}
        </View>

        {/* ─── LIVE ROUTE TRACKING CARD ─── */}
        <View style={styles.trackingCard}>
          <View style={styles.trackingTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.trackingLabel}>Pickup From</Text>
              <Text style={styles.trackingDonor}>{pickup.donor}</Text>
              <View style={styles.addrRow}>
                <Icon name="pin" size={13} color={Colors.textSecondary} />
                <Text style={styles.addrText}>{pickup.address}</Text>
              </View>
            </View>
            <View style={[styles.statusBadge, pickupStatus === 'ARRIVED' && styles.statusBadgeArrived]}>
              <Text style={[styles.statusText, pickupStatus === 'ARRIVED' && styles.statusTextArrived]}>
                {pickupStatus === 'ARRIVED' ? 'ARRIVED' : 'ON THE WAY'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.currentStatusLabel}>Current Status</Text>
          <Text style={styles.currentStatus}>
            {pickupStatus === 'ARRIVED' ? 'Arrived at pickup location' : 'On the way to pickup location'}
          </Text>

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
            onPress={handleArrived}
            style={[styles.arrivedBtn, pickupStatus === 'ARRIVED' && { backgroundColor: Colors.textMuted }]}
            accessibilityRole="button"
            accessibilityLabel="Arrived at pickup location"
            disabled={pickupStatus === 'ARRIVED'}
          >
            <Icon name="check-circle" size={17} color={Colors.white} />
            <Text style={styles.arrivedBtnText}>Arrived</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, gap: 14, paddingBottom: 32 },

  mapContainer: {
    height: 220,
    backgroundColor: Colors.surfaceMuted,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  map: { flex: 1 },
  mockMap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    gap: 8,
  },
  mockMapText: { fontSize: 13, color: Colors.primaryDark, fontWeight: '600' },

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
  
  statusBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  statusBadgeArrived: {
    backgroundColor: '#DBEAFE',
  },
  statusText: { fontSize: 10, fontWeight: '700', color: Colors.primaryDark, letterSpacing: 0.5 },
  statusTextArrived: { color: '#1E40AF' },

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
