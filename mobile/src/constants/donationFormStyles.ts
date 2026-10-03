import { StyleSheet } from 'react-native';

import { Colors } from '@/constants/colors';

export const donationFormStyles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 24 },
  heading: {
    marginTop: 24,
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  description: {
    marginTop: 6,
    marginBottom: 20,
    fontSize: 14,
    lineHeight: 21,
    color: Colors.textSecondary,
  },
  footer: {
    gap: 10,
  },
  footerButtons: { flexDirection: 'row', gap: 10 },
  backButton: { flex: 1 },
  nextButton: { flex: 2 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
});
