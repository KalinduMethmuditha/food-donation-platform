import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';

const SECTIONS = [
  {
    title: 'Account Information',
    body: 'Your name, contact details, and volunteer ID are stored locally on your device during your session. We do not share your personal information with third parties without your consent.',
  },
  {
    title: 'Location Information',
    body: 'Location data is used only for routing you to pickup destinations and is never stored permanently. It is used solely during active pickup sessions.',
  },
  {
    title: 'Notifications',
    body: 'In-app notifications are generated locally based on your pickup activity. You can control notification types in Notification Preferences.',
  },
  {
    title: 'Volunteer Activity',
    body: 'Your pickup history, status updates, and activity log are maintained locally within your current session. This information helps track your volunteer contribution.',
  },
  {
    title: 'Data Usage',
    body: 'All data shown in this application is managed locally on your device. No personal data is transmitted to external servers in this version of the app.',
  },
];

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <VolunteerScreenHeader title="Privacy Policy" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
          <Text style={styles.headerDate}>Last updated: January 2026</Text>
        </View>

        <Text style={styles.intro}>
          Your privacy matters to us. This policy explains what information the Food Donation Platform Volunteer App
          collects and how it is used.
        </Text>

        {SECTIONS.map((s, i) => (
          <View key={i} style={styles.section}>
            <Text style={styles.sectionTitle}>{s.title}</Text>
            <Text style={styles.sectionBody}>{s.body}</Text>
          </View>
        ))}

        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Questions?</Text>
          <Text style={styles.contactBody}>
            If you have any questions about this privacy policy, contact us at:{'\n'}
            privacy@fooddonation.example.com
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40, gap: 20 },

  header: { gap: 4 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  headerDate: { fontSize: 13, color: Colors.textMuted },

  intro: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },

  section: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 8,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  sectionBody: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },

  contactCard: {
    backgroundColor: Colors.primaryWash,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    padding: 16,
    gap: 8,
  },
  contactTitle: { fontSize: 15, fontWeight: '700', color: Colors.primaryDark },
  contactBody: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
});
