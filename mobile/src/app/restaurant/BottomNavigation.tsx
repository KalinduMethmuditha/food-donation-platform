import { Link } from 'expo-router';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Colors } from '@/constants/colors';

type TabName =
  | 'Home'
  | 'Donations'
  | 'Notifications'
  | 'Profile';

type Tab = {
  name: TabName;
  symbol: string;
  href:
    | '/restaurant/dashboard'
    | '/restaurant/donations'
    | '/restaurant/notifications'
    | '/restaurant/profile';
};

const tabs: Tab[] = [
  {
    name: 'Home',
    symbol: '⌂',
    href: '/restaurant/dashboard',
  },
  {
    name: 'Donations',
    symbol: '▤',
    href: '/restaurant/donations',
  },
  {
    name: 'Notifications',
    symbol: '●',
    href: '/restaurant/notifications',
  },
  {
    name: 'Profile',
    symbol: '○',
    href: '/restaurant/profile',
  },
];

type Props = {
  activeTab: TabName;
};

export default function BottomNavigation({
  activeTab,
}: Props) {
  return (
    <View style={styles.navigation}>
      {tabs.map((tab) => {
        const active = tab.name === activeTab;

        return (
          <Link
            key={tab.name}
            href={tab.href}
            replace
            asChild
          >
            <Pressable style={styles.item}>
              <Text
                style={[
                  styles.icon,
                  active && styles.activeIcon,
                ]}
              >
                {tab.symbol}
              </Text>

              <Text
                style={[
                  styles.label,
                  active && styles.activeLabel,
                ]}
              >
                {tab.name}
              </Text>
            </Pressable>
          </Link>
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
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    fontSize: 19,
    color: Colors.textMuted,
  },

  activeIcon: {
    color: Colors.primary,
  },

  label: {
    marginTop: 4,
    fontSize: 10,
    color: Colors.textMuted,
  },

  activeLabel: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
});