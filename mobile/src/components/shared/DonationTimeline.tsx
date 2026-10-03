import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';

type TimelineStatus =
  | 'completed'
  | 'current'
  | 'pending';

type TimelineItem = {
  title: string;
  time?: string;
  status: TimelineStatus;
};

type Props = {
  items: TimelineItem[];
};

export default function DonationTimeline({ items }: Props) {
  return (
    <View>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <View key={item.title} style={styles.row}>
            <View style={styles.timeline}>
              <View
                style={[
                  styles.circle,
                  item.status === 'completed' &&
                    styles.completedCircle,
                  item.status === 'current' &&
                    styles.currentCircle,
                ]}
              >
                {item.status === 'completed' && (
                  <Text style={styles.check}>✓</Text>
                )}
              </View>

              {!isLast && (
                <View
                  style={[
                    styles.line,
                    item.status === 'completed' &&
                      styles.completedLine,
                  ]}
                />
              )}
            </View>

            <View style={styles.content}>
              <Text
                style={[
                  styles.title,
                  item.status === 'pending' &&
                    styles.pendingText,
                ]}
              >
                {item.title}
              </Text>

              {item.time ? (
                <Text style={styles.time}>{item.time}</Text>
              ) : null}

              {item.status === 'current' && (
                <Text style={styles.currentLabel}>
                  Current status
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    minHeight: 72,
  },

  timeline: {
    width: 34,
    alignItems: 'center',
  },

  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  completedCircle: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  currentCircle: {
    borderColor: Colors.primary,
    borderWidth: 5,
  },

  check: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },

  line: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.border,
  },

  completedLine: {
    backgroundColor: Colors.primary,
  },

  content: {
    flex: 1,
    paddingLeft: 8,
    paddingBottom: 18,
  },

  title: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  pendingText: {
    color: Colors.textMuted,
  },

  time: {
    marginTop: 3,
    fontSize: 11,
    color: Colors.textSecondary,
  },

  currentLabel: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
});