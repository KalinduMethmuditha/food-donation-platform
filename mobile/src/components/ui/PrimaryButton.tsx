import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

import { Colors } from '@/constants/colors';

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
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      style={[styles.button, style, (disabled || loading) && styles.disabled]}
      activeOpacity={0.8}
      {...props}
    >
      {loading && <ActivityIndicator color={Colors.white} size="small" />}
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    minHeight: 48,
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  disabled: { opacity: 0.55 },
});
