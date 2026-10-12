import { StyleSheet, Text, TouchableOpacity, type TouchableOpacityProps } from 'react-native';
import { Colors } from '@/constants/colors';

export default function SecondaryButton({ title, style, disabled, ...props }: TouchableOpacityProps & { title: string }) {
  return <TouchableOpacity accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled}
    activeOpacity={0.7} style={[styles.button, style, disabled && styles.disabled]} {...props}>
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>;
}
const styles = StyleSheet.create({
  button: { minHeight: 52, padding: 13, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.surface },
  text: { fontSize: 14, fontWeight: '700', color: Colors.primaryDark },
  disabled: { opacity: 0.5 },
});
