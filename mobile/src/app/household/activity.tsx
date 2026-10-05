import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useHouseholdData } from '@/components/household/HouseholdDataProvider';
import AppHeader from '@/components/shared/AppHeader';
import Screen from '@/components/shared/Screen';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import { Colors } from '@/constants/colors';

export default function HouseholdActivity() {
  const { donations } = useHouseholdData();
  return <Screen footer={null}><AppHeader title="Donation Activity" showBack onBackPress={() => router.back()} /><ScrollView contentContainerStyle={styles.content}>{donations.map((donation) => <Card key={donation.id} style={styles.card}><View style={styles.row}><View style={styles.copy}><Text style={styles.title}>{donation.foodType}</Text><Text style={styles.meta}>Quantity: {donation.quantity} {donation.unit}  •  Today</Text></View><StatusBadge label={donation.status === 'collected' ? 'COMPLETED' : 'ACTIVE'} /></View><View style={styles.divider} /><Text style={styles.link} onPress={() => donation.status === 'collected' ? router.push({ pathname: '/household/donations/delivered', params: { id: donation.id } }) : router.push({ pathname: '/household/donations/[id]', params: { id: donation.id } })}>View Receipt & Impact  &gt;</Text></Card>)}</ScrollView></Screen>;
}
const styles = StyleSheet.create({ content: { padding: 16, gap: 10 }, card: { padding: 16 }, row: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' }, copy: { flex: 1 }, title: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary }, meta: { marginTop: 5, fontSize: 11, color: Colors.textSecondary }, divider: { height: 1, backgroundColor: Colors.border, marginVertical: 14 }, link: { fontSize: 12, fontWeight: '700', color: Colors.primaryDark } });
