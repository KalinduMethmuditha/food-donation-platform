import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import { useDonationDraftStore } from '@/stores/donationDraft.store';

type Tab = 'home' | 'donate' | 'history' | 'profile';

export default function HouseholdBottomNav({ activeTab }: { activeTab: Tab }) {
  const resetDraft = useDonationDraftStore((state) => state.resetDraft);
  const tabs = [
    { id: 'home' as const, label: 'Home', icon: 'home' as const, onPress: () => router.replace('/household/dashboard') },
    { id: 'donate' as const, label: 'Donate', icon: 'plus' as const, onPress: () => {
      resetDraft();
      router.push('/household/create-donation/food-details');
    } },
    { id: 'history' as const, label: 'History', icon: 'clock' as const, onPress: () => router.replace('/household/activity') },
    { id: 'profile' as const, label: 'Profile', icon: 'user' as const, onPress: () => router.replace('/household/profile') },
  ];

  return <View style={styles.bar}>
    {tabs.map((tab) => <Pressable key={tab.id} accessibilityRole="tab"
      accessibilityState={{ selected: activeTab === tab.id }}
      onPress={tab.onPress} style={styles.tab}>
      <Icon name={tab.icon} size={21} color={activeTab === tab.id ? Colors.primaryDark : Colors.textMuted} />
      <Text style={[styles.label, activeTab === tab.id && styles.active]}>{tab.label}</Text>
    </Pressable>)}
  </View>;
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', backgroundColor: Colors.surface },
  tab: { flex: 1, minHeight: 52, alignItems: 'center', justifyContent: 'center', gap: 4 },
  label: { fontSize: 10, fontWeight: '600', color: Colors.textMuted },
  active: { color: Colors.primaryDark },
});
