import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';

type Tab = { label: string; icon: 'home' | 'truck' | 'activity' | 'user'; route: string };

const TABS: Tab[] = [
  { label: 'Home', icon: 'home', route: '/volunteer/dashboard' },
  { label: 'Pickups', icon: 'truck', route: '/volunteer/pickup-details' },
  { label: 'Activity', icon: 'activity', route: '/volunteer/confirmation' },
  { label: 'Profile', icon: 'user', route: '/volunteer/dashboard' },
];

type Props = { activeTab?: string; onPress?: (route: string) => void };

export default function VolunteerBottomNav({ activeTab = 'Home', onPress }: Props) {
  return (
    <View style={styles.bar}>
      {TABS.map((tab) => {
        const isActive = tab.label === activeTab;
        return (
          <Pressable
            key={tab.label}
            onPress={() => onPress?.(tab.route)}
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
    paddingBottom: 4,
  },
  tab: {
    flex: 1,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
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
