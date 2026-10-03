import { StyleSheet, Text, View } from 'react-native';

import AppHeader from '@/components/restaurant/AppHeader';
import BottomNavigation from '@/components/restaurant/BottomNavigation';
import { Colors } from '@/constants/colors';

export default function RestaurantProfileScreen() {
  return (
    <View style={styles.screen}>
      <AppHeader title="Profile" />

      <View style={styles.content}>
        <Text style={styles.title}>
          Green Leaf Restaurant
        </Text>

        <Text style={styles.subtitle}>
          Restaurant Donor
        </Text>
      </View>

      <BottomNavigation activeTab="Profile" />
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
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 21,
    fontWeight: '800',
    color: Colors.textPrimary,
  },

  subtitle: {
    marginTop: 5,
    fontSize: 13,
    color: Colors.textSecondary,
  },
});