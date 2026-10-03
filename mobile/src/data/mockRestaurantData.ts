import type { Donation } from '@/types/donation';
import type { NotificationItem } from '@/types/notification';

// Frontend demo fixtures. Replace these with API responses when Laravel is connected.
export const restaurantProfile = {
  name: 'Green Leaf Restaurant',
  role: 'Restaurant Donor',
  pickupLocation: 'Green Leaf Restaurant, Main Entrance',
};

export const mockDonations: Donation[] = [
  {
    id: '1024',
    foodType: 'Rice & Curry',
    quantity: 10,
    unit: 'portions',
    description: 'Freshly prepared vegetarian meals. Packed in individual containers.',
    pickupLocation: restaurantProfile.pickupLocation,
    pickupDeadline: 'Today, 3:00 PM',
    status: 'assigned',
    ngoName: 'Hope Community NGO',
    volunteerName: 'S. Perera',
  },
  {
    id: '1025',
    foodType: 'Bakery Items',
    quantity: 24,
    unit: 'items',
    description: 'Fresh bread and pastries, packed and ready for collection.',
    pickupLocation: restaurantProfile.pickupLocation,
    pickupDeadline: 'Today, 5:30 PM',
    status: 'accepted',
    ngoName: 'Hope Community NGO',
  },
  {
    id: '1018',
    foodType: 'Bakery Items',
    quantity: 24,
    unit: 'items',
    description: 'Fresh bread and pastries.',
    pickupLocation: restaurantProfile.pickupLocation,
    pickupDeadline: 'Yesterday, 5:30 PM',
    status: 'collected',
    collectedAt: 'yesterday, 5:10 PM',
    ngoName: 'Hope Community NGO',
    volunteerName: 'S. Perera',
  },
  {
    id: '1014',
    foodType: 'Vegetable Meals',
    quantity: 15,
    unit: 'portions',
    description: 'Vegetable meals packed in individual containers.',
    pickupLocation: restaurantProfile.pickupLocation,
    pickupDeadline: '2 days ago, 3:00 PM',
    status: 'collected',
    collectedAt: '2 days ago, 2:45 PM',
    ngoName: 'Hope Community NGO',
    volunteerName: 'S. Perera',
  },
];

// Lifetime demo totals include earlier donations outside the recent sample list.
export const mockRestaurantStats = { active: 2, completed: 14, total: 16 };

export const mockActivities = [
  {
    id: 'accepted-1024',
    title: 'Donation accepted',
    description: 'Hope Community NGO',
    time: '5 min ago',
    icon: 'check',
  },
  {
    id: 'assigned-1024',
    title: 'Volunteer assigned',
    description: 'S. Perera',
    time: '12 min ago',
    icon: 'users',
  },
] as const;

export const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Volunteer Assigned',
    message: 'S. Perera was assigned to collect your Rice & Curry donation.',
    time: '12:32 PM',
    kind: 'assigned',
    unread: true,
    donationId: '1024',
  },
  {
    id: '2',
    title: 'NGO Accepted Donation',
    message: 'Hope Community NGO accepted your Rice & Curry donation.',
    time: '12:18 PM',
    kind: 'accepted',
    unread: true,
    donationId: '1024',
  },
  {
    id: '3',
    title: 'Donation Published',
    message: 'Nearby NGOs and volunteers were notified.',
    time: '12:05 PM',
    kind: 'published',
    unread: false,
    donationId: '1024',
  },
  {
    id: '4',
    title: 'Food Collected',
    message: 'Your Bakery Items donation was successfully collected.',
    time: 'Yesterday, 5:10 PM',
    kind: 'collected',
    unread: false,
    donationId: '1018',
  },
];
