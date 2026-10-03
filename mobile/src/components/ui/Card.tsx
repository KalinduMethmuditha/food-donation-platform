import { StyleSheet, View, type ViewProps } from 'react-native';
import { Colors } from '@/constants/colors';

export default function Card({ style, ...props }: ViewProps) {
  return <View style={[styles.card, style]} {...props} />;
}
const styles = StyleSheet.create({
  card: { backgroundColor: Colors.surface, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, padding: 16 },
});
