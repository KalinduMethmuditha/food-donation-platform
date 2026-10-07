import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@/components/ui/Icon';

// ---------- Colour palette (same as dashboard) ----------
const C = {
  gradientTop: '#2FB584',
  gradientBottom: '#14855A',
  primary: '#1E9E6A',
  primaryDark: '#14855A',
  tint: '#E3F4EA',
  bg: '#F2F6F4',
  card: '#FFFFFF',
  border: '#E6ECE8',
  text: '#1B2B24',
  muted: '#8A9A93',
  white: '#FFFFFF',
};

type Donation = {
  id: string;
  title: string;
  quantity: string;
  distance: string;
  category: 'Rice' | 'Bread' | 'Fruits' | 'Vegetables';
  emoji: string; // shown when no image is provided
  image?: ImageSourcePropType; // e.g. require('@/assets/images/rice.png')
};

const categories = ['All', 'Rice', 'Bread', 'Fruits', 'Vegetables'] as const;

const donations: Donation[] = [
  { id: '1', title: 'Rice & Curry', quantity: '20 items', distance: '5 km away', category: 'Rice', emoji: '🍛' },
  { id: '2', title: 'Bread & pastries', quantity: '3 bags', distance: '8 km away', category: 'Bread', emoji: '🥐' },
  { id: '3', title: 'Fruits', quantity: '1 item', distance: '12 km away', category: 'Fruits', emoji: '🍎' },
  { id: '4', title: 'Vegetables', quantity: '10 items', distance: '3.5 km away', category: 'Vegetables', emoji: '🥕' },
];

const navItems = [
  { id: 'home', label: 'Home', icon: 'home', route: '/ngo/dashboard' },
  { id: 'donations', label: 'Donations', icon: 'package', route: null },
  { id: 'collections', label: 'Collections', icon: 'truck', route: null },
  { id: 'notifications', label: 'Notifications', icon: 'bell', route: null },
];

export default function NgoDonations() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof categories)[number]>('All');
  const activeTab = 'donations';

  const filtered = useMemo(
    () =>
      donations.filter((d) => {
        const matchCat = category === 'All' || d.category === category;
        const matchText = d.title.toLowerCase().includes(query.trim().toLowerCase());
        return matchCat && matchText;
      }),
    [query, category],
  );

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* ================= HEADER ================= */}
        <LinearGradient colors={[C.gradientTop, C.gradientBottom]} style={styles.header}>
          <SafeAreaView edges={['top']}>
            <View style={styles.headerTop}>
              <TouchableOpacity style={styles.circleBtn} onPress={() => router.back()}>
                <Icon name="arrow-left" size={20} color={C.white} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Available Donations</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* ================= SEARCH + FILTER (overlaps header) ================= */}
        <View style={styles.searchRow}>
          <View style={[styles.card, styles.searchBox]}>
            <Icon name="search" size={18} color={C.muted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search donations..."
              placeholderTextColor={C.muted}
              style={styles.searchInput}
            />
          </View>
          <TouchableOpacity style={[styles.card, styles.filterBtn]}>
            <Icon name="filter" size={20} color={C.primaryDark} />
          </TouchableOpacity>
        </View>

        {/* ================= CATEGORY CHIPS ================= */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {categories.map((c) => {
            const active = c === category;
            return (
              <TouchableOpacity
                key={c}
                activeOpacity={0.8}
                onPress={() => setCategory(c)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{c}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ================= DONATION LIST ================= */}
        <View style={styles.list}>
          {filtered.map((d) => (
            <TouchableOpacity
              key={d.id}
              activeOpacity={0.85}
              style={[styles.card, styles.item]}
              // onPress={() => router.push({ pathname: '/ngo/donation-details', params: { id: d.id } })}
            >
              {d.image ? (
                <Image source={d.image} style={styles.thumb} />
              ) : (
                <View style={[styles.thumb, styles.thumbPlaceholder]}>
                  <Text style={{ fontSize: 38 }}>{d.emoji}</Text>
                </View>
              )}

              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.itemTitle}>{d.title}</Text>
                <Text style={styles.itemQty}>Quantity: {d.quantity}</Text>

                <View style={styles.distRow}>
                  <Icon name="map-pin" size={12} color={C.primary} />
                  <Text style={styles.distText}>{d.distance}</Text>
                </View>

                <View style={styles.tag}>
                  <Text style={styles.tagText}>{d.category.toUpperCase()}</Text>
                </View>
              </View>

              <View style={styles.arrowBtn}>
                <Icon name="chevron-right" size={16} color={C.primaryDark} />
              </View>
            </TouchableOpacity>
          ))}

          {filtered.length === 0 && (
            <View style={styles.empty}>
              <Text style={{ fontSize: 40 }}>🍽️</Text>
              <Text style={styles.emptyText}>No donations found</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ================= BOTTOM NAV ================= */}
      <SafeAreaView edges={['bottom']} style={styles.navWrap}>
        <View style={styles.nav}>
          {navItems.map((n) => {
            const active = n.id === activeTab;
            return (
              <TouchableOpacity
                key={n.id}
                style={styles.navItem}
                onPress={() => n.route && router.push(n.route as any)}
              >
                <View style={[styles.navIconWrap, active && styles.navIconActive]}>
                  <Icon name={n.icon as any} size={20} color={active ? C.primaryDark : C.muted} />
                </View>
                <Text style={[styles.navLabel, active && styles.navLabelActive]}>{n.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
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