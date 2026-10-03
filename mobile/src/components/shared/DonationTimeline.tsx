import { StyleSheet, Text, View } from 'react-native';

import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import type { DonationTimelineItem } from '@/types/donation';

type Props = { items: DonationTimelineItem[] };

export default function DonationTimeline({ items }: Props) {
  return (
    <View>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <View
            key={item.title}
            accessible
            accessibilityLabel={`${item.title}, ${item.status}${item.time ? `, ${item.time}` : ''}`}
            style={[styles.row, isLast && styles.lastRow]}
          >
            <View style={styles.timeline}>
              <View style={[
                styles.circle,
                item.status === 'completed' && styles.completedCircle,
                item.status === 'current' && styles.currentCircle,
              ]}>
                {item.status === 'completed' ? <Icon name="check" size={14} color={Colors.white} /> : null}
              </View>
              {!isLast ? (
                <View style={[styles.line, item.status === 'completed' && styles.completedLine]} />
              ) : null}
            </View>

            <View style={[styles.content, isLast && styles.lastContent]}>
              <Text style={[styles.title, item.status === 'pending' && styles.pendingText]}>{item.title}</Text>
              {item.time ? <Text style={styles.time}>{item.time}</Text> : null}
              {item.status === 'current' ? <Text style={styles.currentLabel}>Current status</Text> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', minHeight: 66 },
  lastRow: { minHeight: 24 },
  timeline: { width: 28, alignItems: 'center' },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedCircle: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  currentCircle: { borderColor: Colors.primary, borderWidth: 6, backgroundColor: Colors.surface },
  line: { flex: 1, width: 2, backgroundColor: Colors.border },
  completedLine: { backgroundColor: Colors.primary },
  content: { flex: 1, paddingLeft: 12, paddingBottom: 20, paddingTop: 2 },
  lastContent: { paddingBottom: 0 },
  title: { fontSize: 14, lineHeight: 20, fontWeight: '600', color: Colors.textPrimary },
  pendingText: { color: Colors.textMuted },
  time: { marginTop: 3, fontSize: 12, color: Colors.textSecondary },
  currentLabel: { marginTop: 3, fontSize: 12, fontWeight: '600', color: Colors.primaryDark },
});
