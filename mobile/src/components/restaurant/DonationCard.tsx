import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '@/constants/colors';

type DonationCardProps = {
  foodName: string;
  quantity: string;
  status: string;
  pickupTime: string;
  onPress?: () => void;
};

export default function DonationCard({
  foodName,
  quantity,
  status,
  pickupTime,
  onPress,
}: DonationCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.imagePlaceholder} />

      <View style={styles.content}>
        <Text style={styles.title}>{foodName}</Text>

        <Text style={styles.meta}>{quantity}</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{status}</Text>
        </View>

        <Text style={styles.pickup}>{pickupTime}</Text>
      </View>

      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  imagePlaceholder: {
    width: 76,
    height: 76,
    borderRadius: 12,
    backgroundColor: '#E7E9E8',
  },

  content: {
    flex: 1,
    marginLeft: 12,
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  meta: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 7,
  },

  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primaryDark,
  },

  pickup: {
    marginTop: 7,
    fontSize: 11,
    color: Colors.textSecondary,
  },

  chevron: {
    fontSize: 26,
    color: Colors.textMuted,
  },
});