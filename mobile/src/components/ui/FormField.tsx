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
};

export default function FormField({
  label,
  error,
  multiline,
  style,
  ...props
}: FormFieldProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        multiline={multiline}
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
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 18,
  },

  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 7,
  },

  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
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
    fontSize: 11,
    color: Colors.danger,
    marginTop: 5,
  },
});