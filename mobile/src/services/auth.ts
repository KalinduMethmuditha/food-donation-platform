import { api } from '@/services/api';
import {
  removeToken,
  saveToken,
} from '@/services/tokenStorage';

export type UserRole =
  | 'restaurant'
  | 'household'
  | 'ngo'
  | 'volunteer';

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};

type AuthResponse = {
  message: string;
  user: AuthUser;
  token: string;
};

export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/login', {
    email,
    password,
  });

  await saveToken(data.token);

  return data;
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  role: UserRole;
}): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/register', {
    name: input.name,
    email: input.email,
    password: input.password,

    // Laravel's `confirmed` validation expects this exact name.
    password_confirmation: input.passwordConfirmation,

    role: input.role,
  });

  await saveToken(data.token);

  return data;
}

export async function getCurrentUser(): Promise<AuthUser> {
  const { data } = await api.get<{ user: AuthUser }>('/me');

  return data.user;
}

export async function logoutUser() {
  try {
    await api.post('/logout');
  } finally {
    await removeToken();
  }
}