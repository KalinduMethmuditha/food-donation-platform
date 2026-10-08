import { router } from 'expo-router';
import { Linking, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { Colors } from '@/constants/colors';
import { useSelectedAssignment, useVolunteerAssignments } from '@/store/volunteerAssignments.store';
import { formatDateTime } from '@/utils/dateTime';

let MapView: any = null;
let Marker: any = null;
if (Platform.OS !== 'web') {
  try {
    const maps = require('react-native-maps');
    MapView = maps.default;
    Marker = maps.Marker;
  } catch {
    // The address and external map link remain available.
  }
}

export default function RouteScreen() {
  const assignment = useSelectedAssignment();
  const { advance, isSaving, error } = useVolunteerAssignments();
  const latitude = assignment?.pickupLatitude;
  const longitude = assignment?.pickupLongitude;
  const hasCoordinates = latitude !== undefined && longitude !== undefined;

  const openMap = async () => {
    if (!assignment) return;
    const query = hasCoordinates ? String(latitude) + ',' + String(longitude) : assignment.pickupLocation;
    const url = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);
    await Linking.openURL(url);
  };

  const arrived = async () => {
    if (!assignment) return;
    if (assignment.status === 'pickup') {
      try { await advance(assignment.id, 'arrived'); } catch { return; }
    }
    router.push('/volunteer/collection-status');
  };

  return <SafeAreaView style={styles.safe} edges={['top']}>
    <VolunteerScreenHeader title="Route to Pickup" onBack={() => router.back()} />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      {!assignment ? <Card><Text style={styles.title}>No pickup selected</Text>
        <SecondaryButton title="View Pickups" onPress={() => router.replace('/volunteer/pickup-details')} /></Card> : <>
        {hasCoordinates && MapView ? <View style={styles.map}>
          <MapView style={StyleSheet.absoluteFill} initialRegion={{
            latitude, longitude, latitudeDelta: 0.02, longitudeDelta: 0.02,
          }}>
            <Marker coordinate={{ latitude, longitude }} title={assignment.donorName} description={assignment.pickupLocation} />
          </MapView>
        </View> : <Card style={styles.mapPlaceholder}>
          <Icon name="map" size={42} />
          <Text style={styles.body}>Use Open Map for directions to the pickup address.</Text>
        </Card>}
        <Card style={styles.card}>
          <Text style={styles.label}>PICKUP FROM</Text>
          <Text style={styles.title}>{assignment.donorName}</Text>
          <Text style={styles.body}>{assignment.pickupLocation}</Text>
          <Text style={styles.body}>Pickup before {formatDateTime(assignment.pickupDeadline)}</Text>
          <Text style={styles.body}>Food: {assignment.foodType} · {assignment.quantity} {assignment.unit}</Text>
          <Text style={styles.body}>Status: {assignment.status === 'arrived' ? 'Arrived' : 'On the way'}</Text>
        </Card>
        <View style={styles.actions}>
          <SecondaryButton title="Open Map" style={styles.button} onPress={() => void openMap()} />
          <PrimaryButton title={assignment.status === 'arrived' ? 'Continue' : 'Arrived'}
            style={styles.button} loading={isSaving} onPress={() => void arrived()} />
        </View>
      </>}
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, gap: 16, paddingBottom: 30 },
  map: { height: 280, borderRadius: 16, overflow: 'hidden' },
  mapPlaceholder: { minHeight: 180, alignItems: 'center', justifyContent: 'center', gap: 10 },
  card: { gap: 10 },
  title: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  label: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary },
  body: { fontSize: 13, lineHeight: 20, color: Colors.textSecondary },
  actions: { flexDirection: 'row', gap: 10 },
  button: { flex: 1 },
  error: { color: Colors.danger },
});
