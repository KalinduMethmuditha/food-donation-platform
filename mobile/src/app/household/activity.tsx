import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import HouseholdBottomNav from '@/components/household/HouseholdBottomNav';
import { useHouseholdData } from '@/components/household/HouseholdDataProvider';
import AppHeader from '@/components/shared/AppHeader';
import EmptyState from '@/components/shared/EmptyState';
import Screen from '@/components/shared/Screen';
import Card from '@/components/ui/Card';
import SecondaryButton from '@/components/ui/SecondaryButton';
import StatusBadge from '@/components/ui/StatusBadge';
import { Colors } from '@/constants/colors';
import { getDonationStatusLabel, getDonationTimeLabel } from '@/utils/donation';
import { formatDateTime } from '@/utils/dateTime';

export default function HouseholdActivity() {
  const { donations, isLoading, loadError, refreshDonations } = useHouseholdData();
  useFocusEffect(useCallback(() => { void refreshDonations(); }, [refreshDonations]));

  return <Screen navigation={<HouseholdBottomNav activeTab="history" />}>
    <AppHeader title="Donation History" showBack onBackPress={() => router.replace('/household/dashboard')} />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {isLoading && donations.length === 0 ? <ActivityIndicator color={Colors.primary} /> : null}
      {loadError ? <Card><Text accessibilityRole="alert" style={styles.error}>{loadError}</Text>
        <SecondaryButton title="Try Again" onPress={() => void refreshDonations()} /></Card> : null}
      {!isLoading && donations.length === 0 ? <EmptyState title="No donations yet"
        description="Your household donations will appear here after you publish them." icon="heart" /> : null}
      {donations.map((donation) => <Pressable key={donation.id} onPress={() => router.push({
        pathname: ['collected', 'delivered'].includes(donation.status) ? '/household/donations/delivered' : '/household/donations/[id]',
        params: { id: donation.id },
      })}>
        <Card style={styles.card}>
          <View style={styles.row}><View style={styles.copy}>
            <Text style={styles.title}>{donation.foodType}</Text>
            <Text style={styles.meta}>{donation.quantity} {donation.unit} · {formatDateTime(donation.createdAt)}</Text>
          </View><StatusBadge label={getDonationStatusLabel(donation.status)} /></View>
          <View style={styles.divider} />
          <Text style={styles.meta}>{getDonationTimeLabel(donation)}</Text>
          <Text style={styles.link}>View details →</Text>
        </Card>
      </Pressable>)}
    </ScrollView>
  </Screen>;
}
const styles = StyleSheet.create({ content: { padding: 16, gap: 10 }, card: { padding: 16 }, row: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' }, copy: { flex: 1 }, title: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary }, meta: { marginTop: 5, fontSize: 11, color: Colors.textSecondary }, divider: { height: 1, backgroundColor: Colors.border, marginVertical: 14 }, link: { fontSize: 12, fontWeight: '700', color: Colors.primaryDark, marginTop: 12 }, error: { color: Colors.danger, marginBottom: 12 } });
