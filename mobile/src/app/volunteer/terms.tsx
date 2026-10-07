import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';

const TERMS = [
  {
    title: '1. Volunteer Responsibilities',
    body: 'As a registered volunteer, you agree to collect and deliver food donations in a timely and safe manner, treating donors and recipients with respect and professionalism at all times.',
  },
  {
    title: '2. Food Safety',
    body: 'Volunteers must ensure food items are handled safely and hygienically. Any food that appears spoiled, damaged, or unsafe must be reported immediately using the issue reporting feature.',
  },
  {
    title: '3. Pickup Commitments',
    body: 'When you accept a pickup assignment, you commit to completing it within the assigned time window. If you are unable to complete a pickup, you must notify the coordination team as soon as possible.',
  },
  {
    title: '4. Data and Privacy',
    body: 'Your personal information is collected for volunteer coordination purposes only. We do not share your data with third parties. See our Privacy Policy for details.',
  },
  {
    title: '5. Code of Conduct',
    body: 'Volunteers represent the Food Donation Platform and must behave with integrity, honesty, and kindness. Misconduct, including misuse of donor or recipient information, may result in removal from the platform.',
  },
  {
    title: '6. Liability',
    body: 'The Food Donation Platform is not liable for any accidents, injuries, or damages that occur during volunteer activities. Volunteers are encouraged to follow safe driving and food handling practices.',
  },
  {
    title: '7. Amendments',
    body: 'These terms may be updated periodically. Continued use of the volunteer application constitutes acceptance of the updated terms.',
  },
];

export default function TermsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <VolunteerScreenHeader title="Terms of Service" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Terms of Service</Text>
          <Text style={styles.headerDate}>Effective: January 2026</Text>
        </View>

        <Text style={styles.intro}>
          By using the Food Donation Platform Volunteer App, you agree to these terms. Please read them carefully.
        </Text>

        {TERMS.map((t, i) => (
          <View key={i} style={styles.section}>
            <Text style={styles.sectionTitle}>{t.title}</Text>
            <Text style={styles.sectionBody}>{t.body}</Text>
          </View>
        ))}

        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Have questions?</Text>
          <Text style={styles.contactBody}>
            Contact our support team at legal@fooddonation.example.com for any questions about these terms.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40, gap: 16 },

  header: { gap: 4, marginBottom: 4 },
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
  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
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
