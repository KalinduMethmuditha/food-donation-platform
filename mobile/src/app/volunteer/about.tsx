import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <VolunteerScreenHeader title="About App" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* App Identity */}
        <View style={styles.identityBlock}>
          <View style={styles.logoBox}>
            <Icon name="leaf" size={40} color={Colors.white} />
          </View>
          <Text style={styles.appName}>Food Donation Platform</Text>
          <Text style={styles.appTagline}>Volunteer Mobile App</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>About</Text>
          <Text style={styles.cardBody}>
            The Food Donation Platform connects volunteers, donors, and NGOs to reduce food waste and
            support communities in need. Volunteers like you play a vital role in collecting surplus
            food from donors and delivering it to those who need it most.{'\n\n'}
            Together, we are making a real difference — one pickup at a time.
          </Text>
        </View>

        {/* Key Features */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Key Features</Text>
          {[
            { icon: 'truck', text: 'Real-time pickup management' },
            { icon: 'route', text: 'Route tracking and navigation' },
            { icon: 'bell', text: 'Smart notifications' },
            { icon: 'check-circle', text: 'Collection status updates' },
            { icon: 'activity', text: 'Activity history and reporting' },
          ].map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Icon name={f.icon as any} size={18} color={Colors.primaryDark} />
              </View>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>

        {/* Links */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/volunteer/terms' as any)}>
            <Text style={styles.linkText}>Terms of Service</Text>
            <Icon name="chevron.right" size={16} color={Colors.border} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/volunteer/privacy' as any)}>
            <Text style={styles.linkText}>Privacy Policy</Text>
            <Icon name="chevron.right" size={16} color={Colors.border} />
          </TouchableOpacity>
        </View>

        <Text style={styles.copyright}>
          © 2026 Food Donation Platform. All rights reserved.{'\n'}
          Designed with ❤️ to fight food waste.
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, gap: 20, paddingBottom: 40 },

  identityBlock: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  appName: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  appTagline: { fontSize: 15, color: Colors.textSecondary, fontWeight: '500' },
  versionBadge: {
    backgroundColor: Colors.primaryWash,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 4,
  },
  versionText: { fontSize: 13, fontWeight: '700', color: Colors.primaryDark },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 12,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  cardBody: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },

  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: Colors.primaryWash,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },

  linkRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  linkText: { fontSize: 15, color: Colors.primaryDark, fontWeight: '600' },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 4 },

  copyright: { fontSize: 12, color: Colors.textMuted, textAlign: 'center', lineHeight: 18 },
});
