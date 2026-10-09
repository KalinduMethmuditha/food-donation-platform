import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';

type Props = { title: string; onBack: () => void; rightLabel?: string; onRightPress?: () => void };

export default function VolunteerScreenHeader({ title, onBack, rightLabel, onRightPress }: Props) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} style={styles.back} hitSlop={8} accessibilityRole="button" accessibilityLabel="Go back">
        <Text style={styles.backText}>‹ BACK</Text>
      </Pressable>
      <Text accessibilityRole="header" style={styles.title}>{title}</Text>
      {rightLabel ? <Pressable onPress={onRightPress} style={styles.right} accessibilityRole="button" accessibilityLabel={rightLabel}>
        <Text style={styles.rightLabel}>{rightLabel}</Text>
      </Pressable> : <View style={styles.back} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', minHeight: 48, paddingHorizontal: 16, backgroundColor: Colors.background },
  back: { width: 62, minHeight: 44, justifyContent: 'center' },
  backText: { fontSize: 12, fontWeight: '800', color: Colors.primaryDark, letterSpacing: 0.5 },
  title: { flex: 1, fontSize: 17, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
  right: { maxWidth: 92, minHeight: 44, justifyContent: 'center', alignItems: 'flex-end', marginLeft: 8 },
  rightLabel: { fontSize: 12, fontWeight: '700', color: Colors.primaryDark },
});
