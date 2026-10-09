import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import type { IconName } from '@/components/ui/Icon';

type Props = {
  title: string;
  icon: IconName;
  onPress: () => void;
};

export default function VolunteerQuickAction({
  title,
  icon,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.container}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={styles.iconBox}>
        <Icon
          name={icon}
          size={22}
          color={Colors.primaryDark}
        />
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
  },

  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});