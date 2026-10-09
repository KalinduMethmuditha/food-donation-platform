import { router } from 'expo-router';
import BottomTabBar from '@/components/shared/BottomTabBar';
import { restaurantTabs, type RestaurantTab } from '@/constants/restaurantNavigation';

export default function BottomNavigation({ activeTab }: { activeTab: RestaurantTab }) {
  return <BottomTabBar activeTab={activeTab} tabs={restaurantTabs.map((tab) => ({
    id: tab.name, label: tab.name, icon: tab.icon, onPress: () => router.replace(tab.href),
  }))} />;
}
