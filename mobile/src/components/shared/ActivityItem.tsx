import { StyleSheet, Text, View } from 'react-native';
import Icon, { type IconName } from '@/components/ui/Icon';
import Card from '@/components/ui/Card';
import { Colors } from '@/constants/colors';

export default function ActivityItem({ icon, title, description, time }: {
  icon: IconName; title: string; description: string; time: string;
}) {
  return <Card style={styles.card}>
    <View style={styles.icon}><Icon name={icon} size={20} /></View>
    <View style={styles.content}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.time}>{time}</Text>
    </View>
  </Card>;
}
const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: 12, alignItems: 'center', padding: 13 },
  icon: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, gap: 4 },
  title: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  description: { fontSize: 12, color: Colors.textSecondary },
  time: { fontSize: 11, color: Colors.textSecondary },
});
