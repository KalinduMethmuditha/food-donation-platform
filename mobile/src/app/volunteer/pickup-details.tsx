import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import { mockActivePickup } from '@/data/mockVolunteerData';
import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';
import { useVolunteerStore } from '@/store/volunteerStore';

export default function PickupDetailsScreen() {
  const pickup = mockActivePickup;
  const { pickupStatus, setPickupStatus } = useVolunteerStore();

  const handleCall = () => {
    const url = `tel:${pickup.phone}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Phone dialer is not available on this device.');
      }
    });
  };

  const handleMessage = () => {
    const url = `sms:${pickup.phone}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Messaging is not available on this device.');
      }
    });
  };

  const handleStartRoute = () => {
    if (pickupStatus === 'ASSIGNED') {
      setPickupStatus('ON THE WAY');
    }
    router.push('/volunteer/route');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <VolunteerScreenHeader title="Pickup Details" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ─── DONOR CARD ─── */}
        <View style={styles.donorCard}>
          <View style={styles.donorHeader}>
            <View style={styles.donorIconBox}>
              <Icon name="building" size={24} color={Colors.primaryDark} />
            </View>
            <View style={styles.donorTitleBox}>
              <Text style={styles.donorName}>{pickup.donor}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>{pickupStatus}</Text>
              </View>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.contactRow}>
            <Icon name="pin" size={16} color={Colors.textMuted} />
            <Text style={styles.contactText}>{pickup.address}</Text>
          </View>
          <View style={styles.contactRow}>
            <Icon name="phone" size={16} color={Colors.textMuted} />
            <Text style={styles.contactText}>{pickup.phone}</Text>
          </View>
        </View>

        {/* ─── PICKUP INFO ─── */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Pickup Information</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Food Type</Text>
              <Text style={styles.infoValue}>{pickup.foodType}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Quantity</Text>
              <Text style={styles.infoValue}>{pickup.quantity}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Pickup Window</Text>
              <Text style={styles.infoValue}>{pickup.pickupWindow}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Estimated</Text>
              <Text style={styles.infoValue}>{pickup.estimatedRecipients}</Text>
            </View>
          </View>
        </View>

        {/* ─── SPECIAL NOTES ─── */}
        <View style={styles.notesCard}>
          <View style={styles.notesHeader}>
            <Icon name="info" size={16} color={Colors.warning} />
            <Text style={styles.notesTitle}>Special Notes</Text>
          </View>
          <View style={styles.notesContent}>
            <Text style={styles.noteItem}>• Please arrive before 5:00 PM.</Text>
            <Text style={styles.noteItem}>• Handle food carefully and keep upright during transport.</Text>
          </View>
        </View>

        {/* ─── TAGS ─── */}
        <View style={styles.tagRow}>
          {pickup.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* ─── ACTIONS ─── */}
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleCall}>
            <Icon name="phone" size={18} color={Colors.textPrimary} />
            <Text style={styles.actionBtnText}>Call Donor</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleMessage}>
            <Icon name="message" size={18} color={Colors.textPrimary} />
            <Text style={styles.actionBtnText}>Message</Text>
          </TouchableOpacity>
        </View>

        {pickupStatus !== 'COLLECTED' && pickupStatus !== 'DELIVERED' && (
          <TouchableOpacity style={styles.primaryBtn} onPress={handleStartRoute}>
            <Icon name={pickupStatus === 'ASSIGNED' ? "route" : "map"} size={18} color={Colors.white} />
            <Text style={styles.primaryBtnText}>
              {pickupStatus === 'ASSIGNED' ? 'Start Route' : 'View Route'}
            </Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, gap: 16, paddingBottom: 40 },

  // Cards
  donorCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 12,
  },
  donorHeader: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  donorIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primaryWash,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donorTitleBox: { flex: 1, alignItems: 'flex-start' },
  donorName: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
  statusBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: { fontSize: 10, fontWeight: '800', color: Colors.primaryDark },
  divider: { height: 1, backgroundColor: Colors.border },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  contactText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },

  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 16,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  infoCol: { width: '45%', gap: 4 },
  infoLabel: { fontSize: 12, color: Colors.textMuted },
  infoValue: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },

  notesCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    padding: 16,
    gap: 12,
  },
  notesHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  notesTitle: { fontSize: 14, fontWeight: '700', color: '#92400E' },
  notesContent: { gap: 6 },
  noteItem: { fontSize: 13, color: '#B45309', lineHeight: 18 },

  tagRow: { flexDirection: 'row', gap: 8 },
  tag: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },

  // Actions
  actionGrid: { flexDirection: 'row', gap: 12 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 14,
  },
  actionBtnText: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },

  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primaryDark,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 4,
  },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white },
});
