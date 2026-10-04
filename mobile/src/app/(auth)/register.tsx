import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import PasswordField from '@/components/auth/PasswordField';
import RoleSelector from '@/components/auth/RoleSelector';
import AppHeader from '@/components/shared/AppHeader';
import Screen from '@/components/shared/Screen';
import FormField from '@/components/ui/FormField';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Colors } from '@/constants/colors';
import { demoRoleDestinations, type DemoRole } from '@/constants/demoRoles';
import { type RegistrationErrors, validateEmail, validatePassword } from '@/utils/authValidation';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<DemoRole | null>(null);
  const [errors, setErrors] = useState<RegistrationErrors>({});

  const createAccount = () => {
    const nextErrors: RegistrationErrors = {
      fullName: fullName.trim() ? undefined : 'Please enter your full name.',
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: !confirmPassword ? 'Please confirm your password.'
        : confirmPassword !== password ? 'Passwords do not match.' : undefined,
      role: role ? undefined : 'Please choose a role.',
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean) || !role) return;
    // Frontend demonstration only. No account is created or stored.
    router.replace(demoRoleDestinations[role]);
  };

  return <Screen keyboardAvoiding>
    <AppHeader title="Create Account" showBack onBackPress={() => router.replace('/welcome')} />
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Create your account</Text>
      <Text style={styles.subtitle}>Join the community and help reduce food waste.</Text>
      <FormField label="Full Name" placeholder="Your full name" value={fullName} autoComplete="name"
        onChangeText={(value) => { setFullName(value); setErrors((current) => ({ ...current, fullName: undefined })); }} error={errors.fullName} />
      <FormField label="Email Address" placeholder="you@example.com" value={email} autoComplete="email"
        keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
        onChangeText={(value) => { setEmail(value); setErrors((current) => ({ ...current, email: undefined })); }} error={errors.email} />
      <PasswordField label="Password" value={password} autoComplete="new-password"
        onChangeText={(value) => { setPassword(value); setErrors((current) => ({ ...current, password: undefined })); }} error={errors.password} />
      <PasswordField label="Confirm Password" value={confirmPassword} autoComplete="new-password"
        onChangeText={(value) => { setConfirmPassword(value); setErrors((current) => ({ ...current, confirmPassword: undefined })); }}
        error={errors.confirmPassword} />
      <RoleSelector value={role} error={errors.role} onChange={(value) => {
        setRole(value); setErrors((current) => ({ ...current, role: undefined }));
      }} />
      <PrimaryButton title="Create Account" style={styles.submit} onPress={createAccount} />
      <Text style={styles.footer}>Already have an account?{' '}
        <Text accessibilityRole="link" onPress={() => router.replace('/login')} style={styles.footerLink}>Sign In</Text>
      </Text>
    </ScrollView>
  </Screen>;
}
const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 30 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.textPrimary, marginTop: 12 },
  subtitle: { fontSize: 14, lineHeight: 21, color: Colors.textSecondary, marginTop: 6, marginBottom: 26 },
  submit: { marginTop: 22 },
  footer: { marginTop: 22, textAlign: 'center', fontSize: 13, color: Colors.textSecondary },
  footerLink: { fontWeight: '700', color: Colors.primaryDark },
});
