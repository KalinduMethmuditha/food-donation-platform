import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';

export default function StatCard({ value, label }: { value: string | number; label: string }) {
  return <View style={styles.card}>
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>;
}

const styles = StyleSheet.create({
  card: { flex: 1, backgroundColor: Colors.surface, borderRadius: 12, borderWidth: 1,
    borderColor: Colors.border, paddingVertical: 14, alignItems: 'center' },
  value: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  label: { marginTop: 3, fontSize: 11, color: Colors.textSecondary },
});
