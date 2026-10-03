import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';

export type AppHeaderProps = {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
};

export default function AppHeader({ title, showBack, onBackPress, onMenuPress, onNotificationPress }: AppHeaderProps) {
  const onLeadingPress = showBack ? onBackPress : onMenuPress;
  return (
    <View style={styles.header}>
      {onLeadingPress ? <Pressable accessibilityRole="button" accessibilityLabel={showBack ? 'Go back' : 'Open menu'}
        onPress={onLeadingPress} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
        <Icon name={showBack ? 'arrow-left' : 'menu'} color={Colors.white} />
      </Pressable> : null}
      <Text accessibilityRole="header" style={styles.title}>{title}</Text>
      {onNotificationPress ? <Pressable accessibilityRole="button" accessibilityLabel="Open notifications"
        onPress={onNotificationPress} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
        <Icon name="bell" color={Colors.white} />
      </Pressable> : null}
    </View>
  );
}
const styles = StyleSheet.create({
  header: { backgroundColor: Colors.primary, paddingHorizontal: 10, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 68 },
  iconButton: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22 },
  title: { flex: 1, color: Colors.white, fontSize: 17, lineHeight: 23, fontWeight: '700', marginHorizontal: 6 },
  pressed: { opacity: 0.65 },
});
