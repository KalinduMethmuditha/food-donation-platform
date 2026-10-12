import FoodThumbnail from '@/components/shared/FoodThumbnail';
import { router, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@/components/ui/Icon';
import { C, NgoDesignNav, NgoGradientButton, NgoLoadState } from '@/components/ngo/NgoDesign';
import { useNgoDonations } from '@/store/ngoDonations.store';
import { foodVisual, ngoCategories } from '@/utils/ngoPresentation';

export default function NgoDonations() {
  const { available, refresh, isLoading, error } = useNgoDonations();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [donorRole, setDonorRole] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));
  const filtered = available.filter((item) => (category === 'All' || foodVisual(item.foodType).category === category)
    && (donorRole === 'all' || item.donorRole === donorRole)
    && `${item.foodType} ${item.donorName} ${item.pickupLocation}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <View style={styles.root}>
    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 120 }}>
      <LinearGradient colors={[C.gradientTop, C.gradientBottom]} style={styles.header}><SafeAreaView edges={['top']}><View style={styles.headerTop}>
        <Pressable style={styles.circleBtn} accessibilityRole="button" accessibilityLabel="Back to dashboard" onPress={() => router.replace('/ngo/dashboard')}><Icon name="arrow-left" size={20} color={C.white} /></Pressable><Text style={styles.headerTitle}>Available Donations</Text>
      </View></SafeAreaView></LinearGradient>
      <View style={styles.searchRow}><View style={[styles.card, styles.searchBox]}><Icon name="search" size={18} color={C.muted} /><TextInput accessibilityLabel="Search donations" value={query} onChangeText={setQuery} placeholder="Search donations..." placeholderTextColor={C.muted} style={styles.searchInput} /></View>
        <Pressable accessibilityRole="button" accessibilityLabel="Filter donations" onPress={() => setFilterOpen(true)} style={[styles.card, styles.filterBtn]}><View style={{ gap: 4, alignItems: 'center' }}>{[20, 14, 8].map((width) => <View key={width} style={{ width, height: 2.5, borderRadius: 2, backgroundColor: C.primaryDark }} />)}</View></Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>{ngoCategories.map((item) => <Pressable key={item} accessibilityRole="button" accessibilityState={{ selected: category === item }} onPress={() => setCategory(item)} style={[styles.chip, category === item && styles.chipActive]}><Text style={[styles.chipText, category === item && styles.chipTextActive]}>{item}</Text></Pressable>)}</ScrollView>
      <NgoLoadState loading={isLoading && available.length === 0} error={error} retry={() => { void refresh(); }} />
      <View style={styles.list}>{filtered.map((item) => <Pressable key={item.id} style={[styles.card, styles.item]} accessibilityRole="button" onPress={() => router.push({ pathname: '/ngo/donationdetails', params: { id: item.id } })}>
        <View style={[styles.thumb, styles.thumbPlaceholder]}><FoodThumbnail food={item.foodType} /></View>
        <View style={{ flex: 1, marginLeft: 12 }}><Text style={styles.itemTitle}>{item.foodType}</Text><Text style={styles.itemQty}>Quantity: {item.quantity} {item.unit}</Text><View style={styles.distRow}><Icon name="map" size={12} color={C.primary} /><Text numberOfLines={2} style={[styles.distText, { flex: 1 }]}>{item.pickupLocation}</Text></View><View style={styles.tag}><Text style={styles.tagText}>{foodVisual(item.foodType).category.toUpperCase()}</Text></View><Text style={styles.itemQty}>{item.donorRole === 'restaurant' ? 'Restaurant' : 'Household'} · {item.donorName}</Text></View>
        <View style={styles.arrowBtn}><Icon name="chevron-right" size={16} color={C.primaryDark} /></View>
      </Pressable>)}{!isLoading && !error && filtered.length === 0 ? <View style={styles.empty}><Text style={{ fontSize: 40 }}>🍽️</Text><Text style={styles.emptyText}>No donations found</Text></View> : null}</View>
    </ScrollView>
    <NgoDesignNav active="donations" />
    <Modal visible={filterOpen} transparent animationType="fade" onRequestClose={() => setFilterOpen(false)}><View style={{ flex: 1, backgroundColor: 'rgba(11,30,22,0.55)', justifyContent: 'center', padding: 24 }}><View style={[styles.card, { padding: 24, gap: 14, maxWidth: 360, width: '100%', alignSelf: 'center' }]}><Text style={styles.itemTitle}>Filter by donor</Text>{[['all', 'All donors'], ['restaurant', 'Restaurants'], ['household', 'Households']].map(([value, label]) => <Pressable key={value} accessibilityRole="radio" accessibilityState={{ checked: donorRole === value }} onPress={() => setDonorRole(value)}><Text style={[styles.chipText, { paddingVertical: 8, color: donorRole === value ? C.primaryDark : C.text }]}>{donorRole === value ? '●' : '○'} {label}</Text></Pressable>)}<NgoGradientButton title="Apply filters" onPress={() => setFilterOpen(false)} /><Pressable onPress={() => { setFilterOpen(false); void refresh(); }}><Text style={[styles.tagText, { textAlign: 'center', fontSize: 13 }]}>Refresh donations</Text></Pressable></View></View></Modal>
  </View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // Header
  header: {
    paddingHorizontal: 16,
    paddingBottom: 46,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', paddingTop: 8, gap: 14 },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 19, fontWeight: '700', color: C.white },

  // Shared card
  card: {
    backgroundColor: C.card,
    borderRadius: 18,
    shadowColor: '#0B3D2A',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  // Search
  searchRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginTop: -26 },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 50,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 14, color: C.text, paddingVertical: 0 },
  filterBtn: { width: 50, height: 50, alignItems: 'center', justifyContent: 'center' },

  // Chips
  chipsRow: { paddingHorizontal: 16, paddingVertical: 16, gap: 10 },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
  },
  chipActive: { backgroundColor: C.primary, borderColor: C.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: C.text },
  chipTextActive: { color: C.white },

  // List
  list: { paddingHorizontal: 16, gap: 14 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  thumb: { width: 78, height: 78, borderRadius: 14 },
  thumbPlaceholder: { backgroundColor: C.tint, alignItems: 'center', justifyContent: 'center' },
  itemTitle: { fontSize: 16, fontWeight: '800', color: C.text },
  itemQty: { fontSize: 12, color: C.muted, marginTop: 3 },
  distRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  distText: { fontSize: 12, color: C.muted },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: C.tint,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 7,
  },
  tagText: { fontSize: 9, fontWeight: '800', color: C.primaryDark, letterSpacing: 0.4 },
  arrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.tint,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  // Empty state
  empty: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  emptyText: { fontSize: 14, color: C.muted, fontWeight: '600' },

  // Bottom nav
  navWrap: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 12 },
  nav: {
    flexDirection: 'row',
    backgroundColor: C.card,
    borderRadius: 26,
    paddingVertical: 8,
    marginBottom: 6,
    shadowColor: '#0B3D2A',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -2 },
    elevation: 10,
  },
  navItem: { flex: 1, alignItems: 'center' },
  navIconWrap: { width: 50, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  navIconActive: { backgroundColor: C.tint },
  navLabel: { fontSize: 10, fontWeight: '600', color: C.muted, marginTop: 3 },
  navLabelActive: { color: C.primaryDark },
});