export type LoginErrors = Partial<Record<'email' | 'password', string>>;
export type RegistrationErrors = LoginErrors & Partial<Record<'fullName' | 'confirmPassword' | 'role', string>>;

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return 'Please enter your email address.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Enter a valid email address.';
}

export function validatePassword(password: string): string | undefined {
  if (!password) return 'Please enter your password.';
  if (password.length < 6) return 'Use at least 6 characters.';
}
