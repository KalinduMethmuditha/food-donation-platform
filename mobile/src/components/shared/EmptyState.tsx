import { StyleSheet, Text, View } from 'react-native';
import Icon, { type IconName } from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';

export default function EmptyState({ title, description, icon = 'search' }: {
  title: string; description: string; icon?: IconName;
}) {
  return <View style={styles.container}>
    <View style={styles.icon}><Icon name={icon} size={28} /></View>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.description}>{description}</Text>
  </View>;
}
const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20, gap: 10 },
  icon: { padding: 16, backgroundColor: Colors.primaryLight, borderRadius: 32 },
  title: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
  description: { fontSize: 14, lineHeight: 21, color: Colors.textSecondary, textAlign: 'center' },
});
