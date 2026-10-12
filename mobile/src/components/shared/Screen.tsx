import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { actionFooter } from '@/constants/design';

type Props = { children: ReactNode; footer?: ReactNode; navigation?: ReactNode; keyboardAvoiding?: boolean };

export default function Screen({ children, footer, navigation, keyboardAvoiding = false }: Props) {
  return (
    <SafeAreaView style={styles.safeArea} edges={navigation ? ['top', 'left', 'right'] : ['top', 'bottom', 'left', 'right']}>
      <KeyboardAvoidingView style={styles.screen} enabled={keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.body}>{children}</View>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
        {navigation}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  screen: { flex: 1, backgroundColor: Colors.background, width: '100%', maxWidth: 720, alignSelf: 'center' },
  body: { flex: 1 },
  footer: { ...actionFooter, padding: 16 },
});
