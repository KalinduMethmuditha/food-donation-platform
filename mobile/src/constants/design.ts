import type { ViewStyle } from 'react-native';
import { Colors } from '@/constants/colors';

export const cardSurface: ViewStyle = {
  backgroundColor: Colors.surface,
  borderRadius: 20,
  boxShadow: '0 4px 10px rgba(11,61,42,0.08)',
};

export const actionFooter: ViewStyle = {
  backgroundColor: Colors.surface,
  borderTopLeftRadius: 28,
  borderTopRightRadius: 28,
  boxShadow: '0 -3px 14px rgba(11,61,42,0.1)',
};
