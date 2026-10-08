import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { NgoBottomNav, NgoCard, NgoColors, NgoDonationCard, NgoHeader } from '@/components/ngo/NgoUI';
import { useNgoDonations } from '@/store/ngoDonations.store';

type ListTab = 'available' | 'mine';
type DonorFilter = 'all' | 'restaurant' | 'household';

export default function NgoDonationsScreen() {
  const available = useNgoDonations((state) => state.available);
  const mine = useNgoDonations((state) => state.mine);
  const isLoading = useNgoDonations((state) => state.isLoading);
  const error = useNgoDonations((state) => state.error);
  const refresh = useNgoDonations((state) => state.refresh);
  const [tab, setTab] = useState<ListTab>('available');
  const [donorFilter, setDonorFilter] = useState<DonorFilter>('all');
  const [query, setQuery] = useState('');

  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));

  const filtered = useMemo(() => (tab === 'available' ? available : mine).filter((donation) => {
    const matchesDonor = donorFilter === 'all' || donation.donorRole === donorFilter;
    const search = query.trim().toLowerCase();
    return matchesDonor && (!search || `${donation.foodType} ${donation.donorName} ${donation.pickupLocation}`.toLowerCase().includes(search));
  }), [available, mine, tab, donorFilter, query]);

  return (
    <View style={styles.root}>
      <NgoHeader title="Donations" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.tabs}>
          {(['available', 'mine'] as const).map((item) => (
            <Pressable key={item} onPress={() => setTab(item)} accessibilityRole="tab" accessibilityState={{ selected: tab === item }} style={[styles.tab, tab === item && styles.tabActive]}>
              <Text style={[styles.tabText, tab === item && styles.tabTextActive]}>{item === 'available' ? `Available (${available.length})` : `My Donations (${mine.length})`}</Text>
            </Pressable>
          ))}
        </View>
        <TextInput value={query} onChangeText={setQuery} placeholder="Search food, donor, or location" placeholderTextColor={NgoColors.muted} style={styles.search} accessibilityLabel="Search donations" />
        <View style={styles.filters}>
          {(['all', 'restaurant', 'household'] as const).map((filter) => (
            <Pressable key={filter} onPress={() => setDonorFilter(filter)} accessibilityRole="button" style={[styles.filter, donorFilter === filter && styles.filterActive]}>
              <Text style={[styles.filterText, donorFilter === filter && styles.filterTextActive]}>{filter === 'all' ? 'All donors' : filter === 'restaurant' ? 'Restaurants' : 'Households'}</Text>
            </Pressable>
          ))}
        </View>
        {isLoading && available.length === 0 && mine.length === 0 ? <ActivityIndicator color={NgoColors.primary} /> : null}
        {error ? <NgoCard><Text accessibilityRole="alert" style={styles.error}>{error}</Text><Pressable onPress={() => { void refresh(); }}><Text style={styles.retry}>Try again</Text></Pressable></NgoCard> : null}
        <View style={styles.list}>
          {filtered.map((donation) => (
            <NgoDonationCard key={donation.id} donation={donation} onPress={() => router.push({
              pathname: (tab === 'available' ? '/ngo/donationdetails' : '/ngo/activecollection') as any,
              params: { id: donation.id },
            })} />
          ))}
        </View>
        {!isLoading && !error && filtered.length === 0 ? (
          <NgoCard><Text style={styles.empty}>{tab === 'available' ? 'No published donations match your search.' : 'Donations you accept will appear here.'}</Text></NgoCard>
        ) : null}
      </ScrollView>
      <NgoBottomNav active="donations" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: NgoColors.bg },
  content: { padding: 16, paddingBottom: 32, gap: 14 },
  tabs: { flexDirection: 'row', gap: 8 },
  tab: { flex: 1, borderRadius: 14, backgroundColor: NgoColors.card, padding: 12, alignItems: 'center' },
  tabActive: { backgroundColor: NgoColors.primaryDark },
  tabText: { color: NgoColors.text, fontWeight: '700', fontSize: 12 },
  tabTextActive: { color: NgoColors.white },
  search: { backgroundColor: NgoColors.card, borderWidth: 1, borderColor: NgoColors.border, borderRadius: 12, minHeight: 50, paddingHorizontal: 14, color: NgoColors.text },
  filters: { flexDirection: 'row', gap: 8 },
  filter: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18, backgroundColor: NgoColors.card },
  filterActive: { backgroundColor: NgoColors.tint },
  filterText: { color: NgoColors.muted, fontSize: 12 },
  filterTextActive: { color: NgoColors.primaryDark, fontWeight: '700' },
  list: { gap: 10 },
  error: { color: NgoColors.danger, marginBottom: 8 },
  retry: { color: NgoColors.primaryDark, fontWeight: '800' },
  empty: { color: NgoColors.muted, lineHeight: 20 },
});
