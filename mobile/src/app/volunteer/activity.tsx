import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon, { IconName } from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';
import VolunteerBottomNav from '@/components/volunteer/VolunteerBottomNav';
import { useVolunteerStore } from '@/store/volunteerStore';

const statusColor = (status?: string) => {
  if (!status) return Colors.primaryDark;
  if (status === 'DELIVERED') return Colors.primaryDark;
  if (status === 'COLLECTED') return Colors.primary;
  if (status === 'ARRIVED') return '#3B82F6';
  if (status === 'ON_WAY') return Colors.warning;
  return Colors.textSecondary;
};

const getIcon = (iconStr: string): IconName => {
  const map: Record<string, IconName> = {
    'check-circle': 'check-circle',
    package: 'package',
    navigation: 'navigation',
    bell: 'bell',
    'alert-triangle': 'alert-triangle',
    info: 'info',
    pin: 'pin',
    activity: 'activity',
    truck: 'truck',
    check: 'check',
    message: 'message',
  };

  return map[iconStr] ?? 'info';
};

export default function ActivityScreen() {
  const { activities } = useVolunteerStore();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <VolunteerScreenHeader
        title="Activity"
        onBack={() => router.back()}
      />

      <View style={styles.screen}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>
            Today's Activity
          </Text>

          <Text style={styles.summaryCount}>
            {activities.length} Total Updates
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.timelineContent}
          showsVerticalScrollIndicator={false}
        >
          {activities.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon
                name="leaf"
                size={48}
                color={Colors.border}
              />

              <Text style={styles.emptyTitle}>
                No Activity Yet
              </Text>

              <Text style={styles.emptyDesc}>
                Your pickup activity will appear here.
              </Text>
            </View>
          ) : (
            activities.map((activity, index) => (
              <View
                key={activity.id}
                style={styles.timelineRow}
              >
                {/* Connector Line */}
                {index < activities.length - 1 && (
                  <View style={styles.timelineLine} />
                )}

                {/* Icon Box */}
                <View
                  style={[
                    styles.iconBox,
                    {
                      backgroundColor: statusColor(
                        activity.status
                      ),
                    },
                  ]}
                >
                  <Icon
                    name={getIcon(activity.icon)}
                    size={18}
                    color={Colors.white}
                  />
                </View>

                {/* Content Card */}
                <View style={styles.activityCard}>
                  <Text style={styles.activityTitle}>
                    {activity.title}
                  </Text>

                  <Text style={styles.activityDesc}>
                    {activity.description}
                  </Text>

                  <Text style={styles.activityTime}>
                    {activity.timestamp}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      <VolunteerBottomNav
        activeTab="Activity"
        onPress={(route) => router.push(route as any)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  screen: {
    flex: 1,
    padding: 16,
  },

  summaryCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  summaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },

  summaryCount: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 4,
  },

  timelineContent: {
    paddingBottom: 40,
    paddingLeft: 8,
  },

  timelineRow: {
    flexDirection: 'row',
    marginBottom: 20,
    position: 'relative',
  },

  timelineLine: {
    position: 'absolute',
    left: 18,
    top: 38,
    bottom: -20,
    width: 2,
    backgroundColor: Colors.border,
  },

  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    borderWidth: 3,
    borderColor: Colors.background,
  },

  activityCard: {
    flex: 1,
    marginLeft: 16,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  activityTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  activityDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },

  activityTime: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 8,
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 16,
  },

  emptyDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
});