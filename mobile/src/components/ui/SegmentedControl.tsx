import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';

type Option<T extends string> = { label: string; value: T };
type Props<T extends string> = { options: readonly Option<T>[]; value: T; onChange: (value: T) => void };

export default function SegmentedControl<T extends string>({ options, value, onChange }: Props<T>) {
  return <View style={styles.container}>
    {options.map((option) => {
      const active = option.value === value;
      return <Pressable key={option.value} accessibilityRole="tab" accessibilityState={{ selected: active }}
        onPress={() => onChange(option.value)} style={({ pressed }) => [styles.item, active && styles.active, pressed && styles.pressed]}>
        <Text style={[styles.label, active && styles.activeLabel]}>{option.label}</Text>
      </Pressable>;
    })}
  </View>;
}
const styles = StyleSheet.create({
  container: { flexDirection: 'row', borderRadius: 14, padding: 4, backgroundColor: Colors.surfaceMuted },
  item: { flex: 1, minHeight: 44, padding: 10, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  active: { backgroundColor: Colors.surface },
  label: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  activeLabel: { color: Colors.primaryDark, fontWeight: '700' },
  pressed: { opacity: 0.65 },
});
