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
  container: { flexDirection: 'row', gap: 8 },
  item: { flex: 1, minHeight: 40, padding: 10, borderRadius: 22, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center' },
  active: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  label: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  activeLabel: { color: Colors.white, fontWeight: '700' },
  pressed: { opacity: 0.65 },
});
