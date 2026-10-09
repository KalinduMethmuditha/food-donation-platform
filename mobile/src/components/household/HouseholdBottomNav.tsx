import { router } from 'expo-router';
import BottomTabBar from '@/components/shared/BottomTabBar';
import { useDonationDraftStore } from '@/stores/donationDraft.store';

type Tab = 'home' | 'donate' | 'history' | 'profile';

export default function HouseholdBottomNav({ activeTab }: { activeTab: Tab }) {
  const resetDraft = useDonationDraftStore((state) => state.resetDraft);
  return <BottomTabBar activeTab={activeTab} tabs={[
    { id: 'home', label: 'Home', icon: 'home', onPress: () => router.replace('/household/dashboard') },
    { id: 'donate', label: 'Donate', icon: 'plus', onPress: () => {
      resetDraft(); router.push('/household/create-donation/food-details');
    } },
    { id: 'history', label: 'History', icon: 'clock', onPress: () => router.replace('/household/activity') },
    { id: 'profile', label: 'Profile', icon: 'user', onPress: () => router.replace('/household/profile') },
  ]} />;
}
