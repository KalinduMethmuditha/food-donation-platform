import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useHouseholdData } from '@/components/household/HouseholdDataProvider';
import AppHeader from '@/components/shared/AppHeader';
import DonationTimeline from '@/components/shared/DonationTimeline';
import EmptyState from '@/components/shared/EmptyState';
import Screen from '@/components/shared/Screen';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import PrimaryButton from '@/components/ui/PrimaryButton';
import StatusBadge from '@/components/ui/StatusBadge';
import { Colors } from '@/constants/colors';
import { getDonationStatusLabel, getDonationTimeline } from '@/utils/donation';

export default function HouseholdDonationDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { donations, deleteDonation } = useHouseholdData();
  const donation = donations.find((item) => item.id === id);
  return <Screen footer={<PrimaryButton title="View Donation Activity" onPress={() => router.push('/household/activity')} />}>
    <AppHeader title="Live Order Tracking" showBack onBackPress={() => router.back()} />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {!donation ? <EmptyState title="Donation not found" description="This donation is no longer available." /> : <>
        <Card><View style={styles.summary}><View style={styles.icon}><Icon name="heart" size={28} /></View><View style={styles.copy}><Text style={styles.title}>{donation.foodType}</Text><Text style={styles.meta}>{donation.quantity} {donation.unit}</Text><StatusBadge label={getDonationStatusLabel(donation.status)} /></View></View><Text style={styles.location}>{donation.pickupLocation}</Text><View style={styles.actions}><Pressable style={styles.actionButton} onPress={() => router.push({ pathname: '/household/create-donation/food-details', params: { donationId: donation.id } })}><Text style={styles.actionText}>Edit</Text></Pressable><Pressable style={[styles.actionButton, styles.deleteButton]} onPress={() => Alert.alert('Delete donation?', 'This will remove the donation from your activity.', [{ text: 'Keep Donation', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => { deleteDonation(donation.id); router.replace('/household/activity'); } }])}><Text style={styles.deleteText}>Delete</Text></Pressable></View></Card>
        <Text style={styles.section}>Collection Progress</Text><Card><DonationTimeline items={getDonationTimeline(donation.status)} /></Card>
        <Text style={styles.section}>Volunteer</Text><Card><View style={styles.volunteer}><View style={styles.avatar}><Text style={styles.avatarText}>DM</Text></View><View><Text style={styles.volunteerName}>{donation.volunteerName || 'Awaiting assignment'}</Text><Text style={styles.meta}>Verified Food Rescue Volunteer</Text></View></View></Card>
      </>}
    </ScrollView>
  </Screen>;
}
const styles = StyleSheet.create({ content: { padding: 16, paddingBottom: 24 }, summary: { flexDirection: 'row', gap: 12, alignItems: 'center' }, icon: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' }, copy: { flex: 1, gap: 5 }, title: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary }, meta: { fontSize: 12, color: Colors.textSecondary }, location: { marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: Colors.border, fontSize: 13, color: Colors.textSecondary }, actions: { flexDirection: 'row', gap: 10, marginTop: 18, paddingTop: 14, borderTopWidth: 1, borderTopColor: Colors.border }, actionButton: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 1, borderColor: Colors.primary, backgroundColor: Colors.primaryWash }, deleteButton: { borderColor: Colors.danger, backgroundColor: Colors.surface }, actionText: { fontWeight: '700', color: Colors.primaryDark }, deleteText: { fontWeight: '700', color: Colors.danger }, section: { marginTop: 22, marginBottom: 10, fontSize: 17, fontWeight: '700', color: Colors.textPrimary }, volunteer: { flexDirection: 'row', gap: 12, alignItems: 'center' }, avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' }, avatarText: { fontWeight: '700', color: Colors.primaryDark }, volunteerName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary } });
