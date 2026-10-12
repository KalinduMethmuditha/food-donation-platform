import { StyleSheet, Text, View } from 'react-native';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';

export default function BrandMark({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return <View style={[styles.container, compact && styles.compact]}>
    <View style={[styles.mark, light && styles.lightMark]}><Icon name="leaf" size={compact ? 24 : 32}
      color={light ? Colors.white : Colors.primaryDark} /></View>
    <Text style={[styles.name, compact && styles.compactName, light && styles.lightName]}>FoodShare</Text>
  </View>;
}
const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 12 },
  compact: { flexDirection: 'row', gap: 10 },
  mark: { width: 60, height: 60, borderRadius: 20, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  lightMark: { backgroundColor: Colors.primaryDark },
  name: { fontSize: 27, fontWeight: '800', color: Colors.textPrimary },
  compactName: { fontSize: 22 },
  lightName: { color: Colors.white },
});
