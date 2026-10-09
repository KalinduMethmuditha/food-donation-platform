import { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Colors } from '@/constants/colors';
import { isValidPickupCoordinates } from '@/utils/pickupCoordinates';
import type { PickupMapProps } from './PickupMap.types';

const colombo = { latitude: 6.9271, longitude: 79.8612, latitudeDelta: 0.04, longitudeDelta: 0.04 };

export default function PickupMap({ latitude, longitude, onLocationChange }: PickupMapProps) {
  const map = useRef<MapView>(null);
  const pendingLocation = useRef(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState('');
  const coordinate = isValidPickupCoordinates(latitude, longitude)
    ? { latitude: latitude!, longitude: longitude! } : undefined;

  const selectPoint = (point: { latitude: number; longitude: number }) => {
    if (!isValidPickupCoordinates(point.latitude, point.longitude)) {
      setError('Please select a valid pickup point.');
      return;
    }
    onLocationChange(point.latitude, point.longitude);
    setError('');
  };

  const selectCurrentLocation = async () => {
    if (pendingLocation.current) return;
    pendingLocation.current = true;
    setIsLocating(true);
    setError('');
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        setError('Location permission was not granted. You can select the pickup point manually on the map.');
        return;
      }
      const result = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const point = { latitude: result.coords.latitude, longitude: result.coords.longitude };
      selectPoint(point);
      if (isValidPickupCoordinates(point.latitude, point.longitude)) {
        map.current?.animateToRegion({ ...point, latitudeDelta: 0.01, longitudeDelta: 0.01 }, 500);
      }
    } catch {
      setError('Could not determine your current location. Select the pickup point manually.');
    } finally {
      pendingLocation.current = false;
      setIsLocating(false);
    }
  };

  return <View style={styles.container}>
    <View style={styles.mapContainer}>
      <MapView ref={map} style={styles.map} initialRegion={coordinate ? { ...colombo, ...coordinate } : colombo}
        onPress={(event) => selectPoint(event.nativeEvent.coordinate)} toolbarEnabled={false}>
        {coordinate ? <Marker coordinate={coordinate} title="Pickup point" draggable
          onDragEnd={(event) => selectPoint(event.nativeEvent.coordinate)} /> : null}
      </MapView>
    </View>
    <Text style={styles.hint}>{coordinate ? 'Pickup point selected. Tap the map or drag the pin to adjust.' : 'Tap the map to select a pickup point (optional).'}</Text>
    <PrimaryButton title="Use My Current Location" loading={isLocating} onPress={() => void selectCurrentLocation()} />
    {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
  </View>;
}

const styles = StyleSheet.create({
  container: { marginBottom: 20, gap: 10 },
  mapContainer: { height: 220, borderRadius: 14, overflow: 'hidden', backgroundColor: Colors.primaryLight },
  map: { width: '100%', height: '100%' },
  hint: { fontSize: 12, lineHeight: 18, color: Colors.textSecondary },
  error: { fontSize: 12, lineHeight: 18, color: Colors.danger },
});
