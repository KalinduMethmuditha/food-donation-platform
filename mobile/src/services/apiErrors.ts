import { isAxiosError } from 'axios';

type ValidationResponse = {
  errors?: Record<string, string[]>;
};

export function getApiErrorMessage(
  error: unknown,
  action: 'login' | 'register' | 'donation' | 'load',
): string {
  if (!isAxiosError<ValidationResponse>(error)) {
    return 'Something went wrong. Please try again.';
  }

  if (!error.response) {
    return 'Could not connect to the server.';
  }

  const { status, data } = error.response;
  if (status === 401) {
    return action === 'login'
      ? 'Email or password is incorrect.'
      : 'Your session has expired. Please sign in again.';
  }
  if (status === 403) {
    return action === 'donation'
      ? 'You do not have permission to publish donations.'
      : 'You do not have permission to view these donations.';
  }
  if (status === 404 && action === 'load') return 'Donation not found.';
  if (status === 409) return 'This donation can no longer be edited or deleted.';
  if (status === 422) {
    if (action === 'login') return 'Email or password is incorrect.';
    if (action === 'register') {
      return data?.errors?.email?.length
        ? 'That email address is already registered or invalid.'
        : 'Please check your account details and try again.';
    }
    return data?.errors?.pickup_deadline?.length
      ? 'Enter a valid future pickup deadline (YYYY-MM-DD HH:MM:SS).'
      : 'Please check the donation details and try again.';
  }

  return 'Something went wrong. Please try again.';
}
