import type { IconName } from '@/components/ui/Icon';

export type RoleDashboardData = {
  title: string;
  subtitle: string;
  actionTitle: string;
  actionDescription: string;
  actionLabel: string;
  heroIcon: IconName;
  stats: readonly { value: number; label: string }[];
  featuredTitle: string;
  featured: readonly { id: string; name: string; detail: string; status: string; extra: string; destination?: string }[];
  activities: readonly { id: string; icon: IconName; title: string; description: string; time: string }[];
  tabs: readonly { label: string; icon: IconName }[];
};

// Frontend-only dashboard examples. Replace these fixtures with API responses later.
export const mockRoleDashboards = {
  volunteer: {
    title: 'Volunteer Dashboard',
    subtitle: 'Help collect and deliver food donations',
    actionTitle: 'Ready to help?',
    actionDescription: 'Find nearby pickup opportunities and support your community.',
    actionLabel: 'Find Pickups',
    heroIcon: 'truck',
    stats: [{ value: 2, label: 'Assigned' }, { value: 8, label: 'Completed' }, { value: 10, label: 'Total Pickups' }],
    featuredTitle: 'Next Pickup',
    featured: [{ id: 'v1', name: 'Rice & Curry', detail: '10 portions · From Green Leaf Restaurant', destination: 'To Hope Community NGO', status: 'Assigned', extra: 'Pickup today, 3:00 PM' }],
    activities: [
      { id: 'v2', icon: 'truck', title: 'Pickup assigned', description: 'Green Leaf Restaurant', time: '10 min ago' },
      { id: 'v3', icon: 'check', title: 'Delivery completed', description: 'Bakery Items', time: 'Yesterday' },
    ],
    tabs: [{ label: 'Home', icon: 'home' }, { label: 'Pickups', icon: 'truck' }, { label: 'Notifications', icon: 'bell' }, { label: 'Profile', icon: 'user' }],
  },
  household: {
    title: 'Household Dashboard',
    subtitle: 'Share extra food with people who need it',
    actionTitle: 'Have food to share?',
    actionDescription: 'Publish a household food donation in just a few steps.',
    actionLabel: 'Create Donation',
    heroIcon: 'heart',
    stats: [{ value: 1, label: 'Active' }, { value: 6, label: 'Completed' }, { value: 7, label: 'Total' }],
    featuredTitle: 'Latest Donation',
    featured: [{ id: 'h1', name: 'Vegetable Meals', detail: '5 portions', status: 'Accepted', extra: 'Pickup before 6:00 PM' }],
    activities: [
      { id: 'h2', icon: 'check', title: 'Donation accepted', description: 'Community Care NGO', time: '15 min ago' },
      { id: 'h3', icon: 'gift', title: 'Food collected', description: 'Bread & Bakery Items', time: 'Yesterday' },
    ],
    tabs: [{ label: 'Home', icon: 'home' }, { label: 'Donations', icon: 'gift' }, { label: 'Notifications', icon: 'bell' }, { label: 'Profile', icon: 'user' }],
  },
  ngo: {
    title: 'NGO Dashboard',
    subtitle: 'Coordinate donations and food collections',
    actionTitle: 'New food available nearby',
    actionDescription: 'Review available donations before their collection deadlines.',
    actionLabel: 'View Available Donations',
    heroIcon: 'users',
    stats: [{ value: 3, label: 'Available' }, { value: 2, label: 'Accepted' }, { value: 18, label: 'Collected' }],
    featuredTitle: 'Nearby Donations',
    featured: [
      { id: 'n1', name: 'Rice & Curry', detail: '10 portions · Green Leaf Restaurant', status: 'Available', extra: 'Pickup before 3:00 PM · 1.2 km away' },
      { id: 'n2', name: 'Bakery Items', detail: '24 items · City Bakery', status: 'Available', extra: 'Pickup before 5:30 PM · 2.4 km away' },
    ],
    activities: [
      { id: 'n3', icon: 'check', title: 'Donation accepted', description: 'Rice & Curry', time: '5 min ago' },
      { id: 'n4', icon: 'users', title: 'Volunteer assigned', description: 'S. Perera', time: '12 min ago' },
    ],
    tabs: [{ label: 'Home', icon: 'home' }, { label: 'Donations', icon: 'gift' }, { label: 'Volunteers', icon: 'users' }, { label: 'Profile', icon: 'user' }],
  },
} satisfies Record<'volunteer' | 'household' | 'ngo', RoleDashboardData>;
