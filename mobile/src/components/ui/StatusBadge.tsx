import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';

export default function StatusBadge({ label }: { label: string }) {
  return <View style={styles.badge}><Text style={styles.label}>{label}</Text></View>;
}
const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', backgroundColor: Colors.primaryLight, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 20 },
  label: { fontSize: 11, fontWeight: '600', color: Colors.primaryDark },
});
