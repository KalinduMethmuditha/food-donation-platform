import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import BrandMark from '@/components/auth/BrandMark';
import PasswordField from '@/components/auth/PasswordField';
import AppHeader from '@/components/shared/AppHeader';
import Screen from '@/components/shared/Screen';
import FormField from '@/components/ui/FormField';
import PrimaryButton from '@/components/ui/PrimaryButton';

import { Colors } from '@/constants/colors';
import { demoRoleDestinations } from '@/constants/demoRoles';
import { loginUser } from '@/services/auth';
import { getApiErrorMessage } from '@/services/apiErrors';
import {
  type LoginErrors,
  validateEmail,
  validatePassword,
} from '@/utils/authValidation';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState<LoginErrors>({});
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signIn = async () => {
    if (isSubmitting) return;
    const nextErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };

    setErrors(nextErrors);

    if (nextErrors.email || nextErrors.password) {
      return;
    }

    setIsSubmitting(true);
    setAuthError('');

    try {
      const result = await loginUser(
        email.trim(),
        password
      );

      router.replace(
        demoRoleDestinations[result.user.role]
      );
    } catch (error) {
      setAuthError(getApiErrorMessage(error, 'login'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen keyboardAvoiding>
      <AppHeader
        title="Sign In"
        showBack
        onBackPress={() => router.replace('/welcome')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <BrandMark compact />

        <Text style={styles.title}>
          Welcome back
        </Text>

        <Text style={styles.subtitle}>
          Sign in to continue
        </Text>

        <FormField
          label="Email Address"
          placeholder="you@example.com"
          value={email}
          keyboardType="email-address"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(value) => {
            setEmail(value);

            setErrors((current) => ({
              ...current,
              email: undefined,
            }));

            setAuthError('');
          }}
          error={errors.email}
        />

        <PasswordField
          label="Password"
          value={password}
          autoComplete="current-password"
          onChangeText={(value) => {
            setPassword(value);

            setErrors((current) => ({
              ...current,
              password: undefined,
            }));

            setAuthError('');
          }}
          error={errors.password}
        />

        {authError ? (
          <Text
            accessibilityRole="alert"
            style={styles.authError}
          >
            {authError}
          </Text>
        ) : null}

        <PrimaryButton
          title="Sign In"
          style={styles.submit}
          onPress={signIn}
          loading={isSubmitting}
        />

        <Text style={styles.footer}>
          Don&apos;t have an account?{' '}
          <Text
            accessibilityRole="link"
            onPress={() =>
              router.replace('/register')
            }
            style={styles.footerLink}
          >
            Create Account
          </Text>
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 30,
  },

  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 5,
    marginBottom: 26,
  },

  authError: {
    marginTop: 12,
    color: Colors.danger,
    fontSize: 13,
  },

  submit: {
    marginTop: 22,
  },

  footer: {
    marginTop: 22,
    textAlign: 'center',
    fontSize: 13,
    color: Colors.textSecondary,
  },

  footerLink: {
    fontWeight: '700',
    color: Colors.primaryDark,
  },
});
