import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, usePathname } from 'expo-router';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import type { IconName } from '@/components/ui/Icon';

type Tab = { label: string; icon: IconName; route: string };

const TABS: Tab[] = [
  { label: 'Home', icon: 'home', route: '/volunteer/dashboard' },
  { label: 'Pickups', icon: 'truck', route: '/volunteer/pickup-details' },
  { label: 'Activity', icon: 'activity', route: '/volunteer/activity' },
  { label: 'Profile', icon: 'person', route: '/volunteer/profile' },
];

export default function VolunteerBottomNav() {
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname.includes('/dashboard')) return 'Home';
    if (pathname.includes('/activity')) return 'Activity';
    if (pathname.includes('/profile')) return 'Profile';
    // Defaults to Pickups if in routes like /route, /collection-status, etc
    return 'Pickups'; 
  };

  const activeTab = getActiveTab();

  return (
    <View style={styles.bar}>
      {TABS.map((tab) => {
        const isActive = tab.label === activeTab;
        return (
          <Pressable
            key={tab.label}
            onPress={() => router.push(tab.route as any)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.label}
            style={styles.tab}
          >
            <Icon name={tab.icon} size={22} color={isActive ? Colors.primaryDark : Colors.textMuted} />
            <Text style={[styles.tabLabel, isActive && styles.activeLabel]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: 24, // for safe area
  },
  tab: {
    flex: 1,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 12,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  activeLabel: {
    color: Colors.primaryDark,
  },
});
