import { cardSurface } from '@/constants/design';
import { router } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <VolunteerScreenHeader
        title="Volunteer Data & Privacy"
        onBack={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>
          How volunteer data is used in this app
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Account Information
          </Text>

          <Text style={styles.cardText}>
            Your name, email, optional phone and location, and account ID
            are saved with your account on the server. The sign-in token
            is stored on your device.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Location Information
          </Text>

          <Text style={styles.cardText}>
            Donors may provide a pickup address and map point. The route
            screen uses that information to open directions. A location
            entered in your profile is saved with your account.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Notification Data
          </Text>

          <Text style={styles.cardText}>
            Your notification preferences and read state are saved on
            the server. This version shows pickup updates in the app;
            it does not send device push notifications.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Volunteer Activity
          </Text>

          <Text style={styles.cardText}>
            Assigned pickups, progress updates, notes, and support
            requests are saved on the server and shown in your account.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Data Usage
          </Text>

          <Text style={styles.cardText}>
            The app requests account and pickup data from the backend
            when you open volunteer screens. Signing out removes the
            saved sign-in token from this device.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Contact Us
          </Text>

          <Text style={styles.cardText}>
            Use Help &amp; Support in your profile to send a request.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  header: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },

  card: {
    ...cardSurface,
    padding: 16,
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
  },

  cardText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
