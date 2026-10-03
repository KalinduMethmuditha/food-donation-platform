import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import AppHeader from '@/components/restaurant/AppHeader';
import BottomNavigation from '@/components/restaurant/BottomNavigation';
import { useRestaurantData } from '@/components/restaurant/RestaurantDataProvider';
import DonationCard from '@/components/shared/DonationCard';
import EmptyState from '@/components/shared/EmptyState';
import Screen from '@/components/shared/Screen';
import Icon from '@/components/ui/Icon';
import SegmentedControl from '@/components/ui/SegmentedControl';
import { Colors } from '@/constants/colors';

const tabs = [{ label: 'Active', value: 'active' }, { label: 'Completed', value: 'completed' }] as const;

export default function DonationsScreen() {
  const { donations } = useRestaurantData();
  const [selectedTab, setSelectedTab] = useState<'active' | 'completed'>('active');
  const [search, setSearch] = useState('');
  const filteredDonations = donations.filter((donation) =>
    (selectedTab === 'completed' ? donation.status === 'collected' : donation.status !== 'collected') &&
    donation.foodType.toLowerCase().includes(search.trim().toLowerCase()));

  return <Screen>
    <AppHeader title="My Donations" />
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <SegmentedControl options={tabs} value={selectedTab} onChange={setSelectedTab} />
      <View style={styles.search}>
        <Icon name="search" size={20} color={Colors.textSecondary} />
        <TextInput accessibilityLabel="Search donations" placeholder="Search donations..."
          placeholderTextColor={Colors.textMuted} value={search} onChangeText={setSearch}
          style={styles.searchInput} autoCorrect={false} returnKeyType="search" />
      </View>
      <Text accessibilityLiveRegion="polite" style={styles.count}>
        {filteredDonations.length} {selectedTab === 'active' ? 'ACTIVE' : 'COMPLETED'}{' '}
        {filteredDonations.length === 1 ? 'DONATION' : 'DONATIONS'}
      </Text>
      <View style={styles.list}>
        {filteredDonations.map((donation) => <DonationCard key={donation.id} donation={donation}
          onPress={() => router.push({ pathname: '/restaurant/donations/[id]', params: { id: donation.id } })} />)}
      </View>
      {filteredDonations.length === 0 && <EmptyState title="No donations found"
        description={search.trim() ? 'Try another food name or clear your search.' : 'Your donations will appear here.'} />}
    </ScrollView>
    <BottomNavigation activeTab="Donations" />
  </Screen>;
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 30, gap: 16 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, minHeight: 50, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface },
  searchInput: { flex: 1, minWidth: 0, minHeight: 48, fontSize: 14, color: Colors.textPrimary, paddingVertical: 12 },
  count: { fontSize: 11, fontWeight: '700', letterSpacing: 0.7, color: Colors.textSecondary, marginTop: 4 },
  list: { gap: 12 },
});
