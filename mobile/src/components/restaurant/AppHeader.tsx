import { router } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader, { type AppHeaderProps } from '@/components/shared/AppHeader';
import Icon from '@/components/ui/Icon';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { Colors } from '@/constants/colors';
import { restaurantTabs } from '@/constants/restaurantNavigation';

// Restaurant actions live here; the shared header stays presentation-only.
export default function RestaurantHeader(props: AppHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <>
    <AppHeader {...props} onMenuPress={() => setMenuOpen(true)}
      onNotificationPress={props.showBack || props.title === 'Notifications'
        ? undefined
        : () => router.replace('/restaurant/notifications')} />
    <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
      <SafeAreaView style={styles.overlay}>
        <View style={styles.menu} accessibilityViewIsModal>
          <Text style={styles.title}>FoodShare</Text>
          <Text style={styles.subtitle}>Restaurant Donor</Text>
          {restaurantTabs.map((tab) => <Pressable key={tab.name} accessibilityRole="button" accessibilityLabel={tab.name}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            onPress={() => { setMenuOpen(false); router.replace(tab.href); }}>
            <Icon name={tab.icon} /><Text style={styles.label}>{tab.name}</Text><Icon name="chevron-right" size={18} />
          </Pressable>)}
          <SecondaryButton title="Close menu" onPress={() => setMenuOpen(false)} />
        </View>
      </SafeAreaView>
    </Modal>
  </>;
}
const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: Colors.overlay },
  menu: { width: '100%', maxWidth: 440, alignSelf: 'center', padding: 20, borderRadius: 20, backgroundColor: Colors.surface, gap: 8 },
  title: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  subtitle: { fontSize: 13, color: Colors.textSecondary, marginBottom: 12 },
  row: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 8, borderRadius: 10 },
  label: { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  pressed: { backgroundColor: Colors.primaryLight },
});
