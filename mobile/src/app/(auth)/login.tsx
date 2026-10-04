import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import BrandMark from '@/components/auth/BrandMark';
import PasswordField from '@/components/auth/PasswordField';
import RoleSelector from '@/components/auth/RoleSelector';
import AppHeader from '@/components/shared/AppHeader';
import Screen from '@/components/shared/Screen';
import FormField from '@/components/ui/FormField';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Colors } from '@/constants/colors';
import { demoRoleDestinations, type DemoRole } from '@/constants/demoRoles';
import { type LoginErrors, validateEmail, validatePassword } from '@/utils/authValidation';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<DemoRole>('restaurant');
  const [errors, setErrors] = useState<LoginErrors>({});

  const signIn = () => {
    const nextErrors = { email: validateEmail(email), password: validatePassword(password) };
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password) return;
    // Frontend demonstration only. Replace with Laravel Sanctum sign-in later.
    router.replace(demoRoleDestinations[role]);
  };

  return <Screen keyboardAvoiding>
    <AppHeader title="Sign In" showBack onBackPress={() => router.replace('/welcome')} />
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      <BrandMark compact />
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <FormField label="Email Address" placeholder="you@example.com" value={email}
        keyboardType="email-address" autoComplete="email" autoCapitalize="none" autoCorrect={false}
        onChangeText={(value) => { setEmail(value); setErrors((current) => ({ ...current, email: undefined })); }}
        error={errors.email} />
      <PasswordField label="Password" value={password} autoComplete="current-password"
        onChangeText={(value) => { setPassword(value); setErrors((current) => ({ ...current, password: undefined })); }}
        error={errors.password} />

      <View style={styles.roleSection}>
        <RoleSelector compact value={role} onChange={setRole} />
        <Text style={styles.demoNote}>Choose a role to preview its dashboard. No account is checked yet.</Text>
      </View>
      <PrimaryButton title="Sign In" style={styles.submit} onPress={signIn} />
      <Text style={styles.footer}>Don't have an account?{' '}
        <Text accessibilityRole="link" onPress={() => router.replace('/register')} style={styles.footerLink}>Create Account</Text>
      </Text>
    </ScrollView>
  </Screen>;
}
const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 30 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.textPrimary, marginTop: 30 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 5, marginBottom: 26 },
  roleSection: { marginTop: 14 },
  demoNote: { marginTop: 9, fontSize: 12, lineHeight: 18, color: Colors.textSecondary },
  submit: { marginTop: 22 },
  footer: { marginTop: 22, textAlign: 'center', fontSize: 13, color: Colors.textSecondary },
  footerLink: { fontWeight: '700', color: Colors.primaryDark },
});
