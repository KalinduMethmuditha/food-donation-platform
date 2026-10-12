import type { ImageSourcePropType } from 'react-native';

const foodImages: Record<string, ImageSourcePropType> = {
  // Static asset imports let Expo bundle the photos for both web and mobile.
  Rice: require('../../assets/images/rice.jpg'),
  Bread: require('../../assets/images/bread.jpg'),
  Fruits: require('../../assets/images/fruits.jpg'),
  Vegetables: require('../../assets/images/vegetables.jpg'),
};

export function foodVisual(food: string): { category: string; emoji: string; image?: ImageSourcePropType } {
  if (/rice|curry/i.test(food)) return { category: 'Rice', emoji: '🍛', image: foodImages.Rice };
  if (/bread|pastr|bakery|cake|bun/i.test(food)) return { category: 'Bread', emoji: '🥐', image: foodImages.Bread };
  if (/fruit|apple|banana|orange/i.test(food)) return { category: 'Fruits', emoji: '🍎', image: foodImages.Fruits };
  if (/vegetable|carrot|potato|salad/i.test(food)) return { category: 'Vegetables', emoji: '🥕', image: foodImages.Vegetables };
  return { category: 'Food', emoji: '🍽️' };
}
