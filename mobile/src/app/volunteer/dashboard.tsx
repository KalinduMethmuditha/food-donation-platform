import { router } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import {
  mockActivePickup,
  mockVolunteer,
} from '@/data/mockVolunteerData';
import VolunteerBottomNav from '@/components/volunteer/VolunteerBottomNav';
import VolunteerQuickAction from '@/components/volunteer/VolunteerQuickAction';
import { useVolunteerStore } from '@/store/volunteerStore';

const STATUS_LABELS: Record<string, string> = {
  ASSIGNED: 'ASSIGNED',
  ON_WAY: 'ON THE WAY',
  ARRIVED: 'ARRIVED',
  COLLECTED: 'COLLECTED',
  DELIVERED: 'DELIVERED',
};

const STATUS_BG: Record<string, string> = {
  ASSIGNED: Colors.primaryLight,
  ON_WAY: '#FEF3C7',
  ARRIVED: '#DBEAFE',
  COLLECTED: '#D1FAE5',
  DELIVERED: '#D1FAE5',
};

const STATUS_COLOR: Record<string, string> = {
  ASSIGNED: Colors.primaryDark,
  ON_WAY: '#92400E',
  ARRIVED: '#1E40AF',
  COLLECTED: '#065F46',
  DELIVERED: '#065F46',
};

export default function VolunteerDashboard() {
  const { pickupStatus, notifications } =
    useVolunteerStore();

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View style={styles.topBar}>
            <View>
              <Text style={styles.greeting}>
                Hi {mockVolunteer.name} 👋
              </Text>

              <Text style={styles.subGreeting}>
                Here are your assigned collections
              </Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                router.push('/volunteer/notifications')
              }
              style={styles.bellBtn}
              accessibilityRole="button"
              accessibilityLabel="Notifications"
            >
              <Icon
                name="bell"
                size={22}
                color={Colors.textPrimary}
              />

              {unreadCount > 0 && (
                <View style={styles.notifDot} />
              )}
            </TouchableOpacity>
          </View>

          {/* TODAY'S PICKUPS */}
          <View style={styles.todayCard}>
            <View style={styles.todayLeft}>
              <Text style={styles.todayLabel}>
                TODAY'S PICKUPS
              </Text>

              <Text style={styles.todayCount}>
                2 Assigned
              </Text>

              <Text style={styles.todaySub}>
                Complete your pickups on time and{'\n'}
                help reduce food waste.
              </Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                router.push('/volunteer/pickup-details')
              }
              style={styles.viewNextBtn}
            >
              <Text style={styles.viewNextText}>
                View Next
              </Text>
            </TouchableOpacity>
          </View>

          {/* ACTIVE PICKUP */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Active Pickup
            </Text>

            <View style={styles.activeCard}>
              <View style={styles.activeCardTop}>
                <View style={styles.donorIconBox}>
                  <Icon
                    name="building"
                    size={20}
                    color={Colors.primaryDark}
                  />
                </View>

                <View style={styles.activeInfo}>
                  <Text style={styles.donorName}>
                    {mockActivePickup.donor}
                  </Text>

                  <Text style={styles.activeDetail}>
                    {mockActivePickup.quantity} Packed Food
                  </Text>
                </View>

                <View
                  style={[
                    styles.activeBadge,
                    {
                      backgroundColor:
                        STATUS_BG[pickupStatus] ??
                        Colors.primaryLight,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.activeBadgeText,
                      {
                        color:
                          STATUS_COLOR[pickupStatus] ??
                          Colors.primaryDark,
                      },
                    ]}
                  >
                    {STATUS_LABELS[pickupStatus] ??
                      pickupStatus}
                  </Text>
                </View>
              </View>

              <View style={styles.activeMetaRow}>
                <View style={styles.metaItem}>
                  <Icon
                    name="clock"
                    size={14}
                    color={Colors.textSecondary}
                  />

                  <Text style={styles.metaText}>
                    Pickup: {mockActivePickup.pickupTime}
                  </Text>
                </View>

                <View style={styles.metaDot} />

                <View style={styles.metaItem}>
                  <Icon
                    name="route"
                    size={14}
                    color={Colors.textSecondary}
                  />

                  <Text style={styles.metaText}>
                    {mockActivePickup.distance} away
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() =>
                  router.push('/volunteer/pickup-details')
                }
                style={styles.viewDetailsBtn}
              >
                <Text style={styles.viewDetailsText}>
                  View Details
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* QUICK ACTIONS */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Quick Actions
            </Text>

            <View style={styles.quickActionsRow}>
              <VolunteerQuickAction
                title="Route"
                icon="route"
                onPress={() =>
                  router.push('/volunteer/route')
                }
              />

              <VolunteerQuickAction
                title="Status"
                icon="package"
                onPress={() =>
                  router.push(
                    '/volunteer/collection-status'
                  )
                }
              />

              <VolunteerQuickAction
                title="Notifications"
                icon="bell"
                onPress={() =>
                  router.push('/volunteer/notifications')
                }
              />
            </View>
          </View>

          {/* RECENT UPDATES */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Recent Updates
            </Text>

            <View style={styles.updateCard}>
              <View style={styles.updateIconBox}>
                <Icon
                  name="package"
                  size={18}
                  color={Colors.primaryDark}
                />
              </View>

              <View style={styles.updateInfo}>
                <Text style={styles.updateTitle}>
                  New pickup assigned
                </Text>

                <Text style={styles.updateDetail}>
                  From {mockActivePickup.donor} · 2 mins ago
                </Text>

                <View style={styles.tagRow}>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>
                      FR-06
                    </Text>
                  </View>

                  <View style={styles.tag}>
                    <Text style={styles.tagText}>
                      US-02
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <VolunteerBottomNav
          activeTab="Home"
          onPress={(route) =>
            router.push(route as any)
          }
        />
      </View>
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
    backgroundColor: Colors.background,
  },

  scrollContent: {
    paddingBottom: 16,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    backgroundColor: Colors.surface,
  },

  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },

  subGreeting: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 3,
  },

  bellBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.danger,
    borderWidth: 1.5,
    borderColor: Colors.surface,
  },

  todayCard: {
    marginHorizontal: 20,
    marginTop: 18,
    backgroundColor: Colors.primaryDark,
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },

  todayLeft: {
    flex: 1,
  },

  todayLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  todayCount: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.white,
    marginTop: 4,
  },

  todaySub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.80)',
    marginTop: 4,
    lineHeight: 17,
  },

  viewNextBtn: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginLeft: 12,
  },

  viewNextText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryDark,
  },

  section: {
    marginTop: 22,
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },

  activeCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },

  activeCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  donorIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.primaryWash,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  activeInfo: {
    flex: 1,
  },

  donorName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  activeDetail: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  activeBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  activeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  activeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },

  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.textMuted,
  },

  viewDetailsBtn: {
    marginTop: 14,
    backgroundColor: Colors.primaryWash,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },

  viewDetailsText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryDark,
  },

  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },

  updateCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },

  updateIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.primaryWash,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  updateInfo: {
    flex: 1,
  },

  updateTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  updateDetail: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  tagRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },

  tag: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },

  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
});