import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import FormField from '@/components/ui/FormField';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';

export default function PasswordField({ label, value, onChangeText, error, autoComplete }: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  autoComplete?: 'current-password' | 'new-password';
}) {
  const [visible, setVisible] = useState(false);
  return <View style={styles.container}>
    <FormField label={label} placeholder="At least 6 characters" value={value} onChangeText={onChangeText}
      error={error} secureTextEntry={!visible} autoComplete={autoComplete} autoCapitalize="none" autoCorrect={false}
      style={styles.passwordInput} />
    <Pressable accessibilityRole="button" accessibilityLabel={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
      onPress={() => setVisible((current) => !current)} style={styles.toggle}>
      <Icon name={visible ? 'eye-slash' : 'eye'} size={18} color={Colors.textSecondary} />
      <Text style={styles.toggleText}>{visible ? 'Hide' : 'Show'}</Text>
    </Pressable>
  </View>;
}
const styles = StyleSheet.create({
  container: { position: 'relative' },
  passwordInput: { paddingRight: 78 },
  toggle: { position: 'absolute', right: 6, top: 27, minHeight: 48, minWidth: 62, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 4 },
  toggleText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
});
