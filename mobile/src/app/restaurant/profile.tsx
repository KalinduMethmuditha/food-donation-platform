import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AppHeader from '@/components/restaurant/AppHeader';
import BottomNavigation from '@/components/restaurant/BottomNavigation';
import Screen from '@/components/shared/Screen';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import StatusBadge from '@/components/ui/StatusBadge';
import { Colors } from '@/constants/colors';
import { restaurantProfile } from '@/data/mockRestaurantData';

export default function RestaurantProfileScreen() {
  return <Screen>
    <AppHeader title="Profile" />
    <ScrollView contentContainerStyle={styles.content}>
      <Card style={styles.profile}>
        <View style={styles.avatar}><Icon name="leaf" size={38} /></View>
        <Text style={styles.title}>{restaurantProfile.name}</Text>
        <StatusBadge label={restaurantProfile.role} />
        <Text style={styles.subtitle}>Good food. Shared with care.</Text>
      </Card>
      <Card>
        <Text style={styles.label}>Pickup location</Text>
        <View style={styles.locationRow}>
          <Icon name="pin" size={20} />
          <Text style={styles.location}>{restaurantProfile.pickupLocation}</Text>
        </View>
      </Card>
    </ScrollView>
    <BottomNavigation activeTab="Profile" />
  </Screen>;
}
const styles = StyleSheet.create({
  content: { padding: 16, gap: 16, paddingBottom: 30 },
  profile: { alignItems: 'center', paddingVertical: 32, gap: 14 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  location: { flex: 1, fontSize: 14, lineHeight: 21, color: Colors.textSecondary },
});
