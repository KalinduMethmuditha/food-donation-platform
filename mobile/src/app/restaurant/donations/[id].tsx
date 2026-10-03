import { router, useLocalSearchParams } from 'expo-router';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AppHeader from '@/components/restaurant/AppHeader';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Colors } from '@/constants/colors';

export default function DonationDetailsScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Donation Details"
        showBack
        onBackPress={() =>
          router.replace('/restaurant/dashboard')
        }
      />

      <View style={styles.content}>
        <Text style={styles.title}>
          Donation Published Successfully
        </Text>

        <Text style={styles.id}>
          Donation ID: {id}
        </Text>

        <Text style={styles.status}>
          Current Status: Published
        </Text>

        <PrimaryButton
          title="Back to Dashboard"
          onPress={() =>
            router.replace('/restaurant/dashboard')
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 10,
  },

  id: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
  },

  status: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginBottom: 30,
  },
});