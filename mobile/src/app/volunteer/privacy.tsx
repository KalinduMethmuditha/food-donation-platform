import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <VolunteerScreenHeader title="Privacy Policy" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Last updated January 2026</Text>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Information</Text>
          <Text style={styles.cardText}>We collect your name, email, phone number, and volunteer ID to manage your account. This information is stored locally on your device during your session.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Location Information</Text>
          <Text style={styles.cardText}>Location data is only used for pickup routing and navigation assistance. We do not store or transmit your location to any backend systems in this version of the app.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notification Data</Text>
          <Text style={styles.cardText}>Notification preferences are stored locally on your device. Push notifications require your permission and are managed through device settings.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Volunteer Activity</Text>
          <Text style={styles.cardText}>Pickup history, status updates, and activity logs are stored locally on your device for session purposes only. No data is sent to servers.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Data Usage</Text>
          <Text style={styles.cardText}>All data in this version of the app is stored locally. We are committed to protecting your privacy and will update this policy as our data practices evolve.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Us</Text>
          <Text style={styles.cardText}>For privacy concerns, email us at privacy@fooddonation.lk or call +94 11 234 5678.</Text>
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
