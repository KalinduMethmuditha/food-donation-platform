import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';

export default function WelcomeScreen() {
  const handleLogin = () => {
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>

        <View style={styles.hero}>
          <View style={styles.logoBox}>
            <Icon name="leaf" size={52} color={Colors.white} />
          </View>
          <Text style={styles.appName}>Food Donation Platform</Text>
          <Text style={styles.tagline}>Connecting volunteers, donors{'\n'}and communities in need.</Text>
        </View>

        <View style={styles.card}>
          <Icon name="check-circle" size={28} color={Colors.primaryDark} />
          <Text style={styles.cardTitle}>You've been logged out</Text>
          <Text style={styles.cardBody}>Thank you for volunteering. Your contributions make a real difference.</Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>1,200+</Text>
            <Text style={styles.statLabel}>Food Packs Delivered</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>450+</Text>
            <Text style={styles.statLabel}>Active Volunteers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>32</Text>
            <Text style={styles.statLabel}>Partner Donors</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Icon name="person" size={20} color={Colors.white} />
          <Text style={styles.loginBtnText}>Log Back In</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>Food Donation Platform v1.0.0</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center', gap: 24 },

  hero: { alignItems: 'center', gap: 12 },
  logoBox: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  appName: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
  tagline: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  cardTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  cardBody: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },

  stats: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 20,
    width: '100%',
    alignItems: 'center',
  },
  statBox: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 20, fontWeight: '800', color: Colors.primaryDark },
  statLabel: { fontSize: 11, color: Colors.textMuted, textAlign: 'center' },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.border },

  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryDark,
    borderRadius: 14,
    paddingVertical: 16,
    width: '100%',
    gap: 10,
  },
  loginBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white },

  footer: { fontSize: 12, color: Colors.textMuted },
});
