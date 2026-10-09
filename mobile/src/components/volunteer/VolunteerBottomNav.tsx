import { router, type Href } from 'expo-router';
import BottomTabBar from '@/components/shared/BottomTabBar';
import type { IconName } from '@/components/ui/Icon';

const tabs: { label: string; icon: IconName; route: Href }[] = [
  { label: 'Home', icon: 'home', route: '/volunteer/dashboard' },
  { label: 'Pickups', icon: 'truck', route: '/volunteer/pickup-details' },
  { label: 'Activity', icon: 'activity', route: '/volunteer/activity' },
  { label: 'Profile', icon: 'user', route: '/volunteer/profile' },
];

export default function VolunteerBottomNav({ activeTab = 'Home', onPress }: { activeTab?: string; onPress?: (route: string) => void }) {
  return <BottomTabBar activeTab={activeTab} tabs={tabs.map((tab) => ({
    id: tab.label, label: tab.label, icon: tab.icon,
    onPress: () => onPress ? onPress(String(tab.route)) : router.replace(tab.route),
  }))} />;
}
