import { create } from 'axios';
import { Platform } from 'react-native';

import { getToken } from '@/services/tokenStorage';

const defaultApiUrl =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8000/api'
    : 'http://127.0.0.1:8000/api';

export const api = create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? defaultApiUrl,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
