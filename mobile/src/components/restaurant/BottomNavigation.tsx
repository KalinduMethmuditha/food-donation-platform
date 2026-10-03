import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '@/constants/colors';

type TabName = 'Home' | 'Donations' | 'Notifications' | 'Profile';

type BottomNavigationProps = {
  activeTab: TabName;
};

const tabs: TabName[] = [
  'Home',
  'Donations',
  'Notifications',
  'Profile',
];

export default function BottomNavigation({
  activeTab,
}: BottomNavigationProps) {
  return (
    <View style={styles.navigation}>
      {tabs.map((tab) => {
        const active = tab === activeTab;

        return (
          <TouchableOpacity
            key={tab}
            style={styles.item}
          >
            <View
              style={[
                styles.icon,
                active && styles.activeIcon,
              ]}
            />

            <Text
              style={[
                styles.label,
                active && styles.activeLabel,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navigation: {
    height: 72,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },

  item: {
    flex: 1,
    alignItems: 'center',
  },

  icon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: Colors.textMuted,
  },

  activeIcon: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  label: {
    marginTop: 4,
    fontSize: 10,
    color: Colors.textMuted,
  },

  activeLabel: {
    color: Colors.primaryDark,
    fontWeight: '600',
  },
});