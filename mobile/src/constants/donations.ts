import { ImageSourcePropType } from 'react-native';

export type Donation = {
  id: string;
  title: string;
  quantity: string;
  distance: string;
  category: 'Rice' | 'Bread' | 'Fruits' | 'Vegetables';
  emoji: string; // shown when no image is provided
  image?: ImageSourcePropType; // e.g. require('@/assets/images/rice.png')
  postedAgo: string;
  location: string;
  latitude: number;
  longitude: number;
  pickupBy: string;
  description: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  message: string;
  donorImage?: ImageSourcePropType;
};

export const donations: Donation[] = [
  {
    id: '1',
    title: 'Rice & Curry',
    quantity: '20 items',
    distance: '5 km away',
    category: 'Rice',
    emoji: '🍛',
    postedAgo: 'Posted 2 hours ago',
    location: 'Malabe, Sri Lanka',
    latitude: 6.9061,
    longitude: 79.9707,
    pickupBy: 'Today, 5:00 PM',
    description:
      'Non-perishable food items including canned goods, rice and pasta. Packed in sealed containers and ready for pickup.',
    donorName: 'shevon silva',
    donorEmail: 'shevon@email.com',
    donorPhone: '+61 412 345 678',
    message: 'These items are in good condition and ready for pickup.',
  },
  {
    id: '2',
    title: 'Bread & pastries',
    quantity: '3 bags',
    distance: '8 km away',
    category: 'Bread',
    emoji: '🥐',
    postedAgo: 'Posted 4 hours ago',
    location: 'Kaduwela, Sri Lanka',
    latitude: 6.9337,
    longitude: 79.9843,
    pickupBy: 'Today, 7:00 PM',
    description:
      'Freshly baked bread, buns and pastries left over from today. Best collected this evening while still fresh.',
    donorName: 'Nimali Perera',
    donorEmail: 'nimali@email.com',
    donorPhone: '+94 77 123 4567',
    message: 'Baked today. Please collect before 7 PM while still fresh.',
  },
  {
    id: '3',
    title: 'Fruits',
    quantity: '1 item',
    distance: '12 km away',
    category: 'Fruits',
    emoji: '🍎',
    postedAgo: 'Posted 5 hours ago',
    location: 'Colombo 07, Sri Lanka',
    latitude: 6.9094,
    longitude: 79.8615,
    pickupBy: 'Tomorrow, 10:00 AM',
    description:
      'One large crate of mixed seasonal fruits including apples, oranges and bananas. Please bring a vehicle.',
    donorName: 'Kasun Fernando',
    donorEmail: 'kasun@email.com',
    donorPhone: '+94 71 234 5678',
    message: 'Fruits are fresh and packed in a crate. A vehicle is needed.',
  },
  {
    id: '4',
    title: 'Vegetables',
    quantity: '10 items',
    distance: '3.5 km away',
    category: 'Vegetables',
    emoji: '🥕',
    postedAgo: 'Posted 1 day ago',
    location: 'Battaramulla, Sri Lanka',
    latitude: 6.8995,
    longitude: 79.918,
    pickupBy: 'Today, 6:30 PM',
    description:
      'Fresh vegetables including carrots, leeks, tomatoes and green leaves from the local market. Stored in crates.',
    donorName: 'Ayesha Rahman',
    donorEmail: 'ayesha@email.com',
    donorPhone: '+94 76 345 6789',
    message: 'Vegetables are fresh from the market and stored in crates.',
  },
];