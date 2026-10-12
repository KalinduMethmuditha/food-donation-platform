import type { IconName } from '@/components/ui/Icon';

export type DemoRole = 'restaurant' | 'household' | 'ngo' | 'volunteer';

export const demoRoles: readonly {
  id: DemoRole;
  title: string;
  description: string;
  icon: IconName;
}[] = [
  { id: 'restaurant', title: 'Restaurant Donor', description: 'Share surplus food from your restaurant.', icon: 'building' },
  { id: 'household', title: 'Household Donor', description: 'Donate safe surplus food from your household.', icon: 'home' },
  { id: 'ngo', title: 'NGO / Food Bank', description: 'Receive and coordinate available donations.', icon: 'users' },
  { id: 'volunteer', title: 'Volunteer', description: 'Help collect and deliver food donations.', icon: 'truck' },
];

export const demoRoleDestinations = {
  restaurant: '/restaurant/dashboard',
  household: '/household/dashboard',
  ngo: '/ngo/dashboard',
  volunteer: '/volunteer/dashboard',
} as const;
