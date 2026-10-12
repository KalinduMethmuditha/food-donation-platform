import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { Colors } from '@/constants/colors';

type FormFieldProps = TextInputProps & {
  label: string;
  error?: string;
  hint?: string;
};

export default function FormField({
  label,
  error,
  hint,
  multiline,
  style,
  ...props
}: FormFieldProps) {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TextInput
        multiline={multiline}
        accessibilityLabel={label}
        accessibilityHint={error || hint}
        placeholderTextColor={Colors.textMuted}
        style={[
          styles.input,
          multiline && styles.multilineInput,
          error && styles.errorInput,
          style,
        ]}
        {...props}
      />

      {error ? (
        <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.errorText}>{error}</Text>
      ) : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 18,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 7,
  },

  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.textPrimary,
  },

  multilineInput: {
    minHeight: 110,
    paddingTop: 12,
    textAlignVertical: 'top',
  },

  errorInput: {
    borderColor: Colors.danger,
  },

  errorText: {
    fontSize: 12,
    color: Colors.danger,
    marginTop: 5,
  },
  hint: { marginTop: 6, fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },
});
