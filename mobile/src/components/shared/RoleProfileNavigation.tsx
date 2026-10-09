import { router, type Href } from 'expo-router';
import HouseholdBottomNav from '@/components/household/HouseholdBottomNav';
import BottomNavigation from '@/components/restaurant/BottomNavigation';
import VolunteerBottomNav from '@/components/volunteer/VolunteerBottomNav';
import { NgoDesignNav } from '@/components/ngo/NgoDesign';
import type { UserRole } from '@/services/auth';

export default function RoleProfileNavigation({ role }: { role: UserRole }) {
  if (role === 'household') return <HouseholdBottomNav activeTab="profile" />;
  if (role === 'restaurant') return <BottomNavigation activeTab="Profile" />;
  if (role === 'volunteer') return <VolunteerBottomNav activeTab="Profile" onPress={(route) => router.push(route as Href)} />;
  return <NgoDesignNav active="profile" />;
}
