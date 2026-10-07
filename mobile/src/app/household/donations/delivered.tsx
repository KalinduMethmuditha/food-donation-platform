import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Screen from '@/components/shared/Screen';
import Card from '@/components/ui/Card';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import { useHouseholdData } from '@/components/household/HouseholdDataProvider';

export default function HouseholdDelivered() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const donation = useHouseholdData().donations.find((item) => item.id === id);
  return <Screen footer={<View style={styles.footer}><SecondaryButton title="View History" onPress={() => router.replace('/household/activity')} /><PrimaryButton title="Back to Home" onPress={() => router.replace('/household/dashboard')} /></View>}><View style={styles.content}><View style={styles.check}><Icon name="check" size={36} color={Colors.white} /></View><Text style={styles.title}>Donation Delivered!</Text><Text style={styles.subtitle}>You helped provide {donation?.quantity || 0} meals to the community today.</Text><Card style={styles.receipt}><Text style={styles.label}>DONATION RECEIPT</Text><View style={styles.row}><Text style={styles.key}>Food Delivered</Text><Text style={styles.value}>{donation?.foodType} ({donation?.quantity} {donation?.unit})</Text></View><View style={styles.row}><Text style={styles.key}>Date & Time</Text><Text style={styles.value}>{donation?.collectedAt || 'Completed today'}</Text></View><View style={styles.row}><Text style={styles.key}>Partner NGO</Text><Text style={[styles.value, styles.green]}>{donation?.ngoName || 'Community partner'}</Text></View><View style={styles.row}><Text style={styles.key}>Volunteer</Text><Text style={styles.value}>{donation?.volunteerName || 'Community volunteer'}</Text></View></Card></View></Screen>;
}
const styles = StyleSheet.create({ content: { flex: 1, alignItems: 'center', padding: 24, paddingTop: 72 }, check: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 22 }, title: { fontSize: 23, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' }, subtitle: { marginTop: 10, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 }, receipt: { width: '100%', marginTop: 28, gap: 17 }, label: { fontSize: 10, fontWeight: '700', color: Colors.textSecondary }, row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 }, key: { fontSize: 12, color: Colors.textSecondary }, value: { flex: 1, textAlign: 'right', fontSize: 12, fontWeight: '700', color: Colors.textPrimary }, green: { color: Colors.primaryDark }, footer: { gap: 10 } });
