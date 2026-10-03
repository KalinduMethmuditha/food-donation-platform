import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

import { Colors } from '@/constants/colors';

type PrimaryButtonProps = TouchableOpacityProps & {
  title: string;
};

export default function PrimaryButton({
  title,
  style,
  ...props
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      activeOpacity={0.8}
      {...props}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});