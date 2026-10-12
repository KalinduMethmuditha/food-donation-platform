import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import { demoRoles, type DemoRole } from '@/constants/demoRoles';

export default function RoleSelector({ value, onChange, compact = false, error }: {
  value: DemoRole | null;
  onChange: (role: DemoRole) => void;
  compact?: boolean;
  error?: string;
}) {
  return <View accessibilityRole="radiogroup">
    <Text style={styles.heading}>{compact ? 'Demo role' : 'Choose your role'}</Text>
    <View style={[styles.options, compact && styles.compactOptions]}>
      {demoRoles.map((role) => {
        const selected = role.id === value;
        return <Pressable key={role.id} accessibilityRole="radio" accessibilityState={{ checked: selected }}
          accessibilityLabel={role.title} onPress={() => onChange(role.id)}
          style={({ pressed }) => [styles.option, compact && styles.compactOption, selected && styles.selected, pressed && styles.pressed]}>
          <View style={[styles.icon, selected && styles.selectedIcon]}><Icon name={role.icon} size={21} /></View>
          <View style={styles.text}>
            <Text style={styles.title}>{role.title}</Text>
            {!compact && <Text style={styles.description}>{role.description}</Text>}
          </View>
          {selected && !compact && <Icon name="check" size={18} />}
        </Pressable>;
      })}
    </View>
    {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
  </View>;
}

const styles = StyleSheet.create({
  heading: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 10 },
  options: { gap: 10 },
  compactOptions: { flexDirection: 'row', flexWrap: 'wrap' },
  option: { minHeight: 68, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.surface, borderRadius: 14, borderWidth: 1, borderColor: Colors.border, padding: 12 },
  compactOption: { width: '48%', minHeight: 58, flexGrow: 1, padding: 8, gap: 8 },
  selected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  pressed: { opacity: 0.7 },
  icon: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  selectedIcon: { backgroundColor: Colors.surface },
  text: { flex: 1 },
  title: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  description: { marginTop: 3, fontSize: 12, lineHeight: 17, color: Colors.textSecondary },
  error: { marginTop: 7, fontSize: 12, color: Colors.danger },
});
