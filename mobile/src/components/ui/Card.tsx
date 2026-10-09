import { StyleSheet, View, type ViewProps } from 'react-native';
import { cardSurface } from '@/constants/design';

export default function Card({ style, ...props }: ViewProps) {
  return <View style={[styles.card, style]} {...props} />;
}
const styles = StyleSheet.create({
  card: { ...cardSurface, padding: 16 },
});
