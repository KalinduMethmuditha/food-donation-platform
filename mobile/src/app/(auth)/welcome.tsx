import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import BrandMark from '@/components/auth/BrandMark';
import Screen from '@/components/shared/Screen';
import Icon from '@/components/ui/Icon';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { Colors } from '@/constants/colors';

export default function WelcomeScreen() {
  return <Screen>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.top}>
        <BrandMark compact />
        <View style={styles.art}>
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle}><Icon name="heart" size={48} color={Colors.white} /></View>
          </View>
          <View style={[styles.orbit, styles.orbitLeft]}><Icon name="leaf" size={28} /></View>
          <View style={[styles.orbit, styles.orbitRight]}><Icon name="users" size={28} /></View>
        </View>
      </View>
      <View style={styles.bottom}>
        <Text style={styles.title}>Share food. Reduce waste.</Text>
        <Text style={styles.description}>Connect surplus food with people and organizations that can put it to good use.</Text>
        <PrimaryButton title="Get Started" onPress={() => router.push('/register')} />
        <SecondaryButton title="I already have an account" onPress={() => router.push('/login')} />
      </View>
    </ScrollView>
  </Screen>;
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, padding: 24, justifyContent: 'space-between', gap: 20 },
  top: { gap: 24 },
  art: { height: 260, backgroundColor: Colors.primaryLight, borderRadius: 28, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  outerCircle: { width: 186, height: 186, borderRadius: 93, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  innerCircle: { width: 92, height: 92, borderRadius: 46, backgroundColor: Colors.primaryDark, alignItems: 'center', justifyContent: 'center' },
  orbit: { position: 'absolute', width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  orbitLeft: { left: 20, bottom: 32 },
  orbitRight: { right: 20, top: 32 },
  bottom: { gap: 12, paddingBottom: 10 },
  title: { fontSize: 30, lineHeight: 36, fontWeight: '800', color: Colors.textPrimary },
  description: { fontSize: 15, lineHeight: 23, color: Colors.textSecondary, marginBottom: 14 },
});
