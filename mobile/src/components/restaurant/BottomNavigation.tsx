import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import { restaurantTabs, type RestaurantTab } from '@/constants/restaurantNavigation';

export default function BottomNavigation({ activeTab }: { activeTab: RestaurantTab }) {
  return (
    <View style={styles.navigation}>
      {restaurantTabs.map((tab) => {
        const active = tab.name === activeTab;
        return <Link key={tab.name} href={tab.href} replace asChild>
          <Pressable accessibilityLabel={tab.name} accessibilityState={{ selected: active }}
            style={styles.item}>
            <View style={[styles.icon, active && styles.activeIcon]}>
              <Icon name={tab.icon} color={active ? Colors.primaryDark : Colors.textSecondary} />
            </View>
            <Text style={[styles.label, active && styles.activeLabel]}>{tab.name}</Text>
          </Pressable>
        </Link>;
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  navigation: { backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border, flexDirection: 'row', paddingVertical: 8 },
  item: { width: '25%', minHeight: 56, alignItems: 'center', justifyContent: 'center', gap: 4 },
  icon: { paddingVertical: 3, paddingHorizontal: 16, borderRadius: 18 },
  activeIcon: { backgroundColor: Colors.primaryLight },
  label: { fontSize: 11, color: Colors.textSecondary },
  activeLabel: { color: Colors.primaryDark, fontWeight: '700' },
});
