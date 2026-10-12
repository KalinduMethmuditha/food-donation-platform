import type { ReactNode } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/colors';

type Props = { children: ReactNode; backgroundColor?: string };

export default function WebRoleFrame({ children, backgroundColor = Colors.background }: Props) {
  if (Platform.OS !== 'web') return <>{children}</>;

  return (
    <View style={styles.page}>
      <View style={[styles.frame, { backgroundColor }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: Colors.surface },
  frame: { flex: 1, width: '100%', maxWidth: 720, alignSelf: 'center' },
});
