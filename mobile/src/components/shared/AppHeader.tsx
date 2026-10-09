import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';

export type AppHeaderProps = {
  title: string; showBack?: boolean; onBackPress?: () => void;
  onMenuPress?: () => void; onNotificationPress?: () => void;
  variant?: 'gradient' | 'plain' | 'hero';
};

export default function AppHeader({ title, showBack, onBackPress, onMenuPress, onNotificationPress,
  variant = showBack ? 'plain' : 'gradient' }: AppHeaderProps) {
  const plain = variant === 'plain';
  const leading = showBack ? onBackPress : onMenuPress;
  const color = plain ? Colors.primaryDark : Colors.white;
  const content = (
    <View style={[styles.row, plain && styles.plainRow]}>
      <View style={styles.side}>
        {leading ? <Pressable accessibilityRole="button" accessibilityLabel={showBack ? 'Go back' : 'Open menu'}
          onPress={leading} hitSlop={8} style={[styles.button, !plain && styles.circle]}>
          {showBack && plain ? <Text style={styles.backText}>‹ BACK</Text> : <Icon name={showBack ? 'arrow-left' : 'menu'} size={20} color={color} />}
        </Pressable> : null}
      </View>
      <Text accessibilityRole="header" style={[styles.title, plain && styles.plainTitle]}>{title}</Text>
      <View style={[styles.side, styles.trailing]}>
        {onNotificationPress ? <Pressable accessibilityRole="button" accessibilityLabel="Open notifications"
          onPress={onNotificationPress} style={[styles.button, !plain && styles.circle]}>
          <Icon name="bell" size={20} color={color} />
        </Pressable> : null}
      </View>
    </View>
  );
  return variant === 'gradient'
    ? <LinearGradient colors={[Colors.gradientTop, Colors.gradientBottom]} style={styles.gradient}>{content}</LinearGradient>
    : content;
}

const styles = StyleSheet.create({
  gradient: { borderBottomLeftRadius: 32, borderBottomRightRadius: 32, paddingBottom: 14 },
  row: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', minHeight: 60 },
  plainRow: { backgroundColor: Colors.background, minHeight: 48 },
  side: { width: 62 }, trailing: { alignItems: 'flex-end' },
  button: { minWidth: 42, minHeight: 42, alignItems: 'center', justifyContent: 'center' },
  circle: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.22)' },
  title: { flex: 1, color: Colors.white, fontSize: 17, lineHeight: 23, fontWeight: '800', textAlign: 'center' },
  plainTitle: { color: Colors.textPrimary },
  backText: { fontSize: 12, fontWeight: '800', color: Colors.primaryDark, letterSpacing: 0.5 },
});
