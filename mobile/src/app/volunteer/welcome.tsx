import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Icon from '@/components/ui/Icon';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Colors } from '@/constants/colors';

export default function VolunteerWelcomeScreen() {
  return <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
    <View style={styles.content}>
      <View style={styles.logo}><Icon name="leaf" size={48} color={Colors.white} /></View>
      <Text style={styles.title}>Food Donation Platform</Text>
      <Text style={styles.body}>You have signed out of your volunteer account.</Text>
      <PrimaryButton title="Log Back In" style={styles.button} onPress={() => router.replace('/login')} />
    </View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center', gap: 16 },
  logo: { width: 96, height: 96, borderRadius: 28, backgroundColor: Colors.primaryDark, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
  body: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
  button: { width: '100%', marginTop: 10 },
});
