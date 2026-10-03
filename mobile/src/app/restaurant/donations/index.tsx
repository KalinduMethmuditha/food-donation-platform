import { router } from 'expo-router';
import { useState } from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import AppHeader from '@/components/restaurant/AppHeader';
import BottomNavigation from '@/components/restaurant/BottomNavigation';
import DonationCard from '@/components/restaurant/DonationCard';
import { Colors } from '@/constants/colors';

type Tab = 'active' | 'completed';

const activeDonations = [
  {
    id: '1024',
    foodName: 'Rice & Curry',
    quantity: '10 portions',
    status: 'Volunteer Assigned',
    info: 'Pickup before 3:00 PM',
  },
  {
    id: '1025',
    foodName: 'Bakery Items',
    quantity: '24 items',
    status: 'Accepted',
    info: 'Pickup before 5:30 PM',
  },
];

const completedDonations = [
  {
    id: '1018',
    foodName: 'Bakery Items',
    quantity: '24 items',
    status: 'Collected',
    info: 'Collected yesterday, 5:10 PM',
  },
  {
    id: '1014',
    foodName: 'Vegetable Meals',
    quantity: '15 portions',
    status: 'Collected',
    info: 'Collected 2 days ago, 2:45 PM',
  },
];

export default function DonationsScreen() {
  const [selectedTab, setSelectedTab] =
    useState<Tab>('active');

  const [search, setSearch] = useState('');

  const donations =
    selectedTab === 'active'
      ? activeDonations
      : completedDonations;

  const filteredDonations = donations.filter((donation) =>
    donation.foodName
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <View style={styles.screen}>
      <AppHeader title="My Donations" />

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'active' && styles.activeTab,
          ]}
          onPress={() => setSelectedTab('active')}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 'active' &&
                styles.activeTabText,
            ]}
          >
            Active
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'completed' &&
              styles.activeTab,
          ]}
          onPress={() => setSelectedTab('completed')}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 'completed' &&
                styles.activeTabText,
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TextInput
          style={styles.searchInput}
          placeholder="Search donations..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />

        <Text style={styles.countLabel}>
          {filteredDonations.length}{' '}
          {selectedTab === 'active'
            ? 'ACTIVE DONATIONS'
            : 'COMPLETED DONATIONS'}
        </Text>

        <View style={styles.list}>
          {filteredDonations.map((donation) => (
            <DonationCard
              key={donation.id}
              foodName={donation.foodName}
              quantity={donation.quantity}
              status={donation.status}
              pickupTime={donation.info}
              onPress={() =>
                router.push({
                  pathname:
                    '/restaurant/donations/[id]',
                  params: {
                    id: donation.id,
                  },
                })
              }
            />
          ))}
        </View>

        {filteredDonations.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              No donations found
            </Text>

            <Text style={styles.emptyDescription}>
              Try another search term.
            </Text>
          </View>
        )}
      </ScrollView>

      <BottomNavigation activeTab="Donations" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 4,
    borderRadius: 12,
    backgroundColor: '#EAEFED',
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: 'center',
  },

  activeTab: {
    backgroundColor: Colors.surface,
  },

  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  activeTabText: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },

  scrollView: {
    flex: 1,
  },

  content: {
    padding: 16,
    paddingBottom: 30,
  },

  searchInput: {
    height: 46,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    fontSize: 13,
    color: Colors.textPrimary,
  },

  countLabel: {
    marginTop: 18,
    marginBottom: 10,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },

  list: {
    gap: 10,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  emptyDescription: {
    marginTop: 5,
    fontSize: 12,
    color: Colors.textSecondary,
  },
});