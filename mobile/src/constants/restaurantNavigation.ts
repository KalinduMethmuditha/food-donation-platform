import type { Href } from 'expo-router';
import type { IconName } from '@/components/ui/Icon';

export const restaurantTabs = [
  { name: 'Home', href: '/restaurant/dashboard', icon: 'home' },
  { name: 'Donations', href: '/restaurant/donations', icon: 'gift' },
  { name: 'Notifications', href: '/restaurant/notifications', icon: 'bell' },
  { name: 'Profile', href: '/restaurant/profile', icon: 'user' },
] as const satisfies readonly { name: string; href: Href; icon: IconName }[];

export type RestaurantTab = (typeof restaurantTabs)[number]['name'];
