import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';

type Props = {
  title: string;
  onBack: () => void;
  rightLabel?: string;
  onRightPress?: () => void;
};

export default function VolunteerScreenHeader({ title, onBack, rightLabel, onRightPress }: Props) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
        <Icon name="arrow-left" size={20} color={Colors.textPrimary} />
      </Pressable>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      {rightLabel ? (
        <Pressable onPress={onRightPress} style={styles.rightBtn} accessibilityRole="button" accessibilityLabel={rightLabel}>
          <Text style={styles.rightLabel}>{rightLabel}</Text>
        </Pressable>
      ) : (
        <View style={styles.rightPlaceholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  rightBtn: {
    minWidth: 36,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rightLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  rightPlaceholder: {
    width: 36,
  },
});
