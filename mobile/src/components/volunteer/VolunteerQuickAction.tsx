import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import type { IconName } from '@/components/ui/Icon';

type Props = {
  title: string;
  icon: IconName;
  badge?: number;
  onPress: () => void;
};

export default function VolunteerQuickAction({ title, icon, badge, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.container} accessibilityRole="button" accessibilityLabel={title}>
      <View style={styles.iconBox}>
        <Icon name={icon} size={22} color={Colors.primaryDark} />
        {badge !== undefined && badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
          </View>
        )}
      </View>
      <Text style={styles.label}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.primaryWash,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: Colors.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
