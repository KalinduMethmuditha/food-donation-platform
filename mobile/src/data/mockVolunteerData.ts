// Mock data for Volunteer feature — frontend only, no backend
export const mockVolunteer = {
  name: 'Nimsara',
  fullName: 'H.G.K Nimsara',
};

export type PickupStatus =
  | 'ACTIVE'
  | 'ASSIGNED'
  | 'COMPLETED';

export type Pickup = {
  id: string;
  donor: string;
  address: string;
  phone: string;
  foodType: string;
  quantity: string;
  pickupWindow: string;
  estimatedRecipients: string;
  distance: string;
  estimatedTime: string;
  status: PickupStatus;
  pickupTime: string;
  referenceId: string;
  collectedTime: string;
  tags: string[];
};

export const mockActivePickup: Pickup = {
  id: 'pk-2041',
  donor: 'Green Leaf Bakery',
  address: '24 Main Street, Negombo',
  phone: '+94 71 234 5678',
  foodType: 'Cooked Rice & Lentils',
  quantity: '12 Packs',
  pickupWindow: '4:30 PM – 5:00 PM',
  estimatedRecipients: '10–12 people',
  distance: '2.4 km',
  estimatedTime: '12 mins',
  status: 'ACTIVE',
  pickupTime: '4:30 PM',
  referenceId: 'PK-2041',
  collectedTime: '4:42 PM',
  tags: ['FR-06', 'US-02'],
};

export const mockAssignedPickup: Pickup = {
  id: 'pk-2042',
  donor: 'City Fresh Market',
  address: '12 Harbour Road, Negombo',
  phone: '+94 77 345 6789',
  foodType: 'Bread & Pastries',
  quantity: '8 Packs',
  pickupWindow: '5:30 PM – 6:00 PM',
  estimatedRecipients: '8–10 people',
  distance: '4.1 km',
  estimatedTime: '20 mins',
  status: 'ASSIGNED',
  pickupTime: '5:30 PM',
  referenceId: 'PK-2042',
  collectedTime: '',
  tags: ['FR-07', 'US-03'],
};

export type NotificationType =
  | 'pickup'
  | 'reminder'
  | 'route'
  | 'collection';

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
  navigateTo: string;
};

export const mockNotifications: AppNotification[] = [
  {
    id: 'n1',
    type: 'pickup',
    title: 'New pickup assigned',
    description:
      'Green Leaf Bakery has assigned a new pickup request.',
    time: '2 mins ago',
    read: false,
    navigateTo: '/volunteer/pickup-details',
  },

  {
    id: 'n2',
    type: 'reminder',
    title: 'Pickup reminder',
    description:
      'Please collect the donation before 5:00 PM.',
    time: '15 mins ago',
    read: false,
    navigateTo: '/volunteer/pickup-details',
  },

  {
    id: 'n3',
    type: 'route',
    title: 'Route updated',
    description:
      'Traffic has increased on your current route.',
    time: '22 mins ago',
    read: true,
    navigateTo: '/volunteer/route',
  },

  {
    id: 'n4',
    type: 'collection',
    title: 'Collection recorded',
    description:
      'Your pickup has been successfully confirmed.',
    time: '1 hour ago',
    read: true,
    navigateTo: '/volunteer/confirmation',
  },
];