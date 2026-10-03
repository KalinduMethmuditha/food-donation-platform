import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';

type ActivityItemProps = {
  icon: string;
  title: string;
  description: string;
  time: string;
};

export default function ActivityItem({
  icon,
  title,
  description,
  time,
}: ActivityItemProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <Text style={styles.time}>{time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },

  content: {
    flex: 1,
    marginLeft: 10,
  },

  title: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },

  description: {
    marginTop: 2,
    fontSize: 11,
    color: Colors.textSecondary,
  },

  time: {
    fontSize: 10,
    color: Colors.textMuted,
  },
});