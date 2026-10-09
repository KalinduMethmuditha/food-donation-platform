import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';
import Icon from '@/components/ui/Icon';
import { cardSurface } from '@/constants/design';

export default function StatCard({ value, label }: { value: string | number; label: string }) {
  return <View style={styles.card}>
    <View style={styles.icon}><Icon name={/complet|deliver|collect/i.test(label) ? 'check' : /total/i.test(label) ? 'gift' : 'clock'} size={14} /></View>
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>;
}

const styles = StyleSheet.create({
  card: { ...cardSurface, flex: 1, padding: 14 },
  value: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  icon: { alignSelf: 'flex-end', width: 26, height: 26, borderRadius: 13,
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  label: { marginTop: 3, fontSize: 11, color: Colors.textSecondary },
});
