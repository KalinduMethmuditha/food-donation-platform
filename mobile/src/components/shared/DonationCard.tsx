import { Pressable, StyleSheet, Text, View } from 'react-native';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import StatusBadge from '@/components/ui/StatusBadge';
import { Colors } from '@/constants/colors';
import type { Donation } from '@/types/donation';
import { getDonationStatusLabel, getDonationTimeLabel } from '@/utils/donation';

export default function DonationCard({ donation, onPress }: { donation: Donation; onPress: () => void }) {
  return <Pressable onPress={onPress} accessibilityRole="button"
    accessibilityLabel={`${donation.foodType}, ${donation.quantity} ${donation.unit}, ${getDonationStatusLabel(donation.status)}. View donation`}
    style={({ pressed }) => pressed && styles.pressed}>
    <Card style={styles.card}>
      <View style={styles.illustration}><Icon name="gift" size={30} /></View>
      <View style={styles.content}>
        <Text style={styles.title}>{donation.foodType}</Text>
        <Text style={styles.quantity}>{donation.quantity} {donation.unit}</Text>
        <StatusBadge label={getDonationStatusLabel(donation.status)} />
        <Text style={styles.time}>{getDonationTimeLabel(donation)}</Text>
      </View>
      <Icon name="chevron-right" size={18} color={Colors.textMuted} />
    </Card>
  </Pressable>;
}
const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  illustration: { width: 58, height: 64, borderRadius: 12, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, gap: 6 },
  title: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  quantity: { fontSize: 13, color: Colors.textSecondary },
  time: { fontSize: 12, lineHeight: 17, color: Colors.textSecondary },
  pressed: { opacity: 0.7 },
});
