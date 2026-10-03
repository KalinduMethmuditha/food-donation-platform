import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '@/constants/colors';

type AppHeaderProps = {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
};

export default function AppHeader({
  title,
  showBack = false,
  onBackPress,
}: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={onBackPress}
      >
        <Text style={styles.icon}>
          {showBack ? '‹' : '☰'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity style={styles.iconButton}>
        <Text style={styles.icon}>●</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 22,
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    color: Colors.white,
    fontSize: 20,
  },

  title: {
    flex: 1,
    marginHorizontal: 10,
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});