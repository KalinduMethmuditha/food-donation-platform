import type { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';

export default function DashboardHero({ header, subtitle, emoji, greeting = 'Welcome back!' }: {
  header: ReactNode; subtitle: string; emoji: string; greeting?: string;
}) {
  return (
    <LinearGradient colors={[Colors.gradientTop, Colors.gradientBottom]} style={styles.hero}>
      {header}
      <View style={styles.welcomeRow}>
        <View style={styles.copy}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.symbol}><Text style={styles.emoji}>{emoji}</Text></View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  hero: { borderBottomLeftRadius: 32, borderBottomRightRadius: 32, paddingBottom: 52 },
  welcomeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, marginTop: 20 },
  copy: { flex: 1 },
  greeting: { color: Colors.white, fontSize: 26, fontWeight: '800' },
  subtitle: { color: Colors.white, opacity: 0.92, fontSize: 12, lineHeight: 18, marginTop: 6 },
  symbol: { width: 76, height: 76, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primaryWash },
  emoji: { fontSize: 40 },
});
