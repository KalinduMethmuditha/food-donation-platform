import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';

export default function TermsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <VolunteerScreenHeader title="Terms of Service" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Effective January 2026</Text>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Volunteer Agreement</Text>
          <Text style={styles.cardText}>By using this app as a volunteer, you agree to collect food donations responsibly, handle food safely, and deliver to the designated recipients in a timely manner.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pickup Responsibilities</Text>
          <Text style={styles.cardText}>Volunteers must arrive at pickup locations within the specified window. Food must be handled with care and kept upright during transport. Any issues must be reported through the app.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Code of Conduct</Text>
          <Text style={styles.cardText}>Volunteers are expected to maintain professional and respectful conduct with donors and recipients. Misuse of the app or false reporting may result in account suspension.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Data & Privacy</Text>
          <Text style={styles.cardText}>By using this app, you consent to the collection and local storage of your activity data as described in our Privacy Policy. No data is transmitted to external servers in this version.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Limitation of Liability</Text>
          <Text style={styles.cardText}>Food Donation Platform is not liable for any issues arising from food quality or safety. Volunteers participate on a voluntary basis and assume responsibility for their actions.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Changes to Terms</Text>
          <Text style={styles.cardText}>We reserve the right to update these terms. Continued use of the app constitutes acceptance of any changes. We will notify volunteers of significant updates.</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact</Text>
          <Text style={styles.cardText}>For questions about these terms, contact legal@fooddonation.lk</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  header: { fontSize: 13, color: Colors.textSecondary, marginBottom: 16, textAlign: 'center' },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  cardText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
});
