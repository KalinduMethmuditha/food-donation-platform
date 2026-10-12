import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import WelcomeIllustration from '@/components/auth/WelcomeIllustration';
import Screen from '@/components/shared/Screen';

export default function WelcomeScreen() {
  return <Screen>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.introduction}>
        <WelcomeIllustration />
        <Text style={styles.title}>Share Extra Food,{'\n'}<Text style={styles.highlight}>Nourish Your Community</Text></Text>
        <Text style={styles.description}>{'Connect instantly with local shelters & neighbors.\nReduce waste, one meal at a time.'}</Text>
      </View>
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" onPress={() => router.push('/register')}
          style={({ pressed }) => [styles.startButton, pressed && styles.pressed]}>
          <LinearGradient colors={['#10B981', '#008460']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.startGradient}>
            <Text style={styles.startText}>Get Started</Text>
          </LinearGradient>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => router.push('/login')}
          style={({ pressed }) => [styles.loginButton, pressed && styles.pressed]}>
          <Text style={styles.loginText}>I Already Have an Account</Text>
        </Pressable>
      </View>
    </ScrollView>
  </Screen>;
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: 6, paddingTop: 24, paddingBottom: 54, justifyContent: 'space-between', gap: 48, backgroundColor: '#F5F8FA' },
  introduction: { width: '100%', maxWidth: 380, alignSelf: 'center' },
  title: { marginTop: 10, fontSize: 24, lineHeight: 31, fontWeight: '800', color: '#0F172A', textAlign: 'center' },
  highlight: { color: '#10B981' },
  description: { marginTop: 16, fontSize: 14, lineHeight: 22, color: '#53647E', textAlign: 'center' },
  actions: { width: '100%', maxWidth: 380, alignSelf: 'center', gap: 10 },
  startButton: { borderRadius: 8, overflow: 'hidden' },
  startGradient: { minHeight: 52, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  startText: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  loginButton: { minHeight: 52, paddingVertical: 12, borderWidth: 1, borderColor: '#DFE7EF', backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  loginText: { fontSize: 16, fontWeight: '700', color: '#17243A', textAlign: 'center' },
  pressed: { opacity: 0.7 },
});
