import { Image, StyleSheet, Text, View } from 'react-native';
import { foodVisual } from '@/utils/foodPresentation';

export default function FoodThumbnail({ food, emojiSize = 30, borderRadius = 12 }: {
  food: string;
  emojiSize?: number;
  borderRadius?: number;
}) {
  const visual = foodVisual(food);
  return visual.image ? (
    <Image source={visual.image} accessibilityLabel={`${visual.category} food`} resizeMode="cover" style={[styles.fill, { borderRadius }]} />
  ) : (
    <View style={[styles.fill, styles.fallback]}><Text style={{ fontSize: emojiSize }}>{visual.emoji}</Text></View>
  );
}

const styles = StyleSheet.create({
  fill: { width: '100%', height: '100%' },
  fallback: { alignItems: 'center', justifyContent: 'center' },
});
