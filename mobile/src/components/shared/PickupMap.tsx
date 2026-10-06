import { StyleSheet, Text, View } from 'react-native';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import type { PickupMapProps } from './PickupMap.types';

// Metro selects PickupMap.native.tsx on Android/iOS; web never imports native maps.
export default function PickupMap(_props: PickupMapProps) {
  return <View style={styles.container}>
    <Icon name="pin" size={28} />
    <Text style={styles.text}>Map selection is available on the mobile app.</Text>
    <Text style={styles.hint}>You can continue using the pickup location above.</Text>
  </View>;
}

const styles = StyleSheet.create({
  container: { minHeight: 145, padding: 20, marginBottom: 20, borderRadius: 14, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', gap: 10 },
  text: { color: Colors.textPrimary, fontSize: 14, textAlign: 'center' },
  hint: { color: Colors.textSecondary, fontSize: 12, textAlign: 'center' },
});
