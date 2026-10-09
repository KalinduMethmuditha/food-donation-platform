import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

import { Colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

type PrimaryButtonProps = TouchableOpacityProps & {
  title: string;
  loading?: boolean;
};

export default function PrimaryButton({
  title,
  style,
  loading = false,
  disabled,
  ...props
}: PrimaryButtonProps) {
  const background = StyleSheet.flatten(style)?.backgroundColor;
  const customBackground = background && background !== Colors.primary && background !== Colors.primaryDark;
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      style={[styles.button, style, (disabled || loading) && styles.disabled]}
      activeOpacity={0.8}
      {...props}
    >
      <LinearGradient pointerEvents="none" colors={customBackground ? [background, background] : [Colors.gradientTop, Colors.gradientBottom]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      {loading && <ActivityIndicator color={Colors.white} size="small" />}
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
  disabled: { opacity: 0.55 },
});
