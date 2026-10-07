import { create } from 'zustand';

// ─── Types ────────────────────────────────────────────────────────────────────

export type PickupStatus =
  | 'ASSIGNED'
  | 'ON_WAY'
  | 'ARRIVED'
  | 'COLLECTED'
  | 'DELIVERED';

export interface VolunteerProfile {
  volunteerId: string;
  fullName: string;
  phone: string;
  email: string;
  location: string;
  avatarUrl: string | null;
  joinedDate: string;
}

export interface PickupPreferences {
  preferredStartTime: string;
  preferredEndTime: string;
  preferredArea: string;
  pickupRadius: string;
  foodTypes: string[];
  availableToday: boolean;
  availableDays: string[];
}

export interface NotificationPreferences {
  newPickupAssigned: boolean;
  pickupReminder: boolean;
  routeUpdates: boolean;
  statusUpdates: boolean;
  deliveryCompleted: boolean;
  activityUpdates: boolean;
  issueUpdates: boolean;
  announcements: boolean;
  generalNotifications: boolean;
  importantAlerts: boolean;
}

export interface ActivityItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  timestamp: string;
  status?: string;
}

export interface AppNotification {
  id: string;
  type:
    | 'pickup'
    | 'reminder'
    | 'route'
    | 'collection'
    | 'update'
    | 'issue'
    | 'system';
  title: string;
  description: string;
  time: string;
  read: boolean;
  navigateTo: string;
}

// ─── Store Interface ──────────────────────────────────────────────────────────

interface VolunteerState {
  // Pickup lifecycle
  pickupStatus: PickupStatus;
  collectedTime: string | null;
  deliveredTime: string | null;
  setPickupStatus: (status: PickupStatus) => void;
  setCollectedTime: (time: string) => void;
  setDeliveredTime: (time: string) => void;

  // Profile
  profile: VolunteerProfile;
  updateProfile: (
    updates: Partial<VolunteerProfile>
  ) => void;

  // Pickup Preferences
  pickupPreferences: PickupPreferences;
  updatePickupPreferences: (
    updates: Partial<PickupPreferences>
  ) => void;

  // Notification Preferences
  notificationPreferences: NotificationPreferences;
  updateNotificationPreferences: (
    updates: Partial<NotificationPreferences>
  ) => void;

  // Activities
  activities: ActivityItem[];
  addActivity: (
    item: Omit<ActivityItem, 'id'>
  ) => void;

  // In-app notifications
  notifications: AppNotification[];
  addNotification: (
    item: Omit<AppNotification, 'id'>
  ) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Support requests
  supportRequests: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
  addSupportRequest: (
    type: string,
    description: string
  ) => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useVolunteerStore = create<VolunteerState>(
  (set, get) => ({
    // ── Pickup Lifecycle ──

    pickupStatus: 'ASSIGNED',
    collectedTime: null,
    deliveredTime: null,

    setPickupStatus: (status) => {
      const now = new Date();

      const timeStr = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      set({
        pickupStatus: status,
      });

      if (status === 'COLLECTED') {
        set({
          collectedTime: timeStr,
        });
      }

      if (status === 'DELIVERED') {
        set({
          deliveredTime: timeStr,
        });
      }

      // Auto-create notification & activity
      // for every status change.
      const messages: Record<
        PickupStatus,
        {
          notif: {
            title: string;
            desc: string;
          };
          act: {
            title: string;
            desc: string;
          };
        }
      > = {
        ASSIGNED: {
          notif: {
            title: 'Pickup assigned',
            desc: 'A new pickup has been assigned to you.',
          },
          act: {
            title: 'Pickup Assigned',
            desc: 'A new pickup was assigned to you from Green Leaf Bakery.',
          },
        },

        ON_WAY: {
          notif: {
            title: 'Route started',
            desc: 'You are now on the way to Green Leaf Bakery.',
          },
          act: {
            title: 'Route Started',
            desc: 'You started navigating to Green Leaf Bakery.',
          },
        },

        ARRIVED: {
          notif: {
            title: 'Volunteer arrived',
            desc: 'You have arrived at the pickup location.',
          },
          act: {
            title: 'Arrived at Pickup',
            desc:
              'You arrived at Green Leaf Bakery, 24 Main Street, Negombo.',
          },
        },

        COLLECTED: {
          notif: {
            title: 'Collection recorded',
            desc:
              '12 food packs have been collected from Green Leaf Bakery.',
          },
          act: {
            title: 'Food Collected',
            desc: `12 food packs collected at ${timeStr}.`,
          },
        },

        DELIVERED: {
          notif: {
            title: 'Delivery completed',
            desc:
              'The donation delivery has been completed successfully.',
          },
          act: {
            title: 'Delivery Completed',
            desc:
              `Donation delivered successfully at ${timeStr}.`,
          },
        },
      };

      const msg = messages[status];

      if (msg) {
        get().addNotification({
          type: 'system',
          title: msg.notif.title,
          description: msg.notif.desc,
          time: 'Just now',
          read: false,
          navigateTo: '/volunteer/collection-status',
        });

        get().addActivity({
          icon:
            status === 'DELIVERED'
              ? 'check-circle'
              : status === 'COLLECTED'
                ? 'package'
                : 'navigation',
          title: msg.act.title,
          description: msg.act.desc,
          timestamp: timeStr,
          status,
        });
      }
    },

    setCollectedTime: (time) =>
      set({
        collectedTime: time,
      }),

    setDeliveredTime: (time) =>
      set({
        deliveredTime: time,
      }),

    // ── Profile ──

    profile: {
      volunteerId: 'VOL-2041',
      fullName: 'H.G.K Nimsara',
      phone: '+94 71 234 5678',
      email: 'nimsara@example.com',
      location: 'Negombo, Sri Lanka',
      avatarUrl: null,
      joinedDate: 'January 2026',
    },

    updateProfile: (updates) =>
      set((state) => ({
        profile: {
          ...state.profile,
          ...updates,
        },
      })),

    // ── Pickup Preferences ──

    pickupPreferences: {
      preferredStartTime: '4:00 PM',
      preferredEndTime: '6:00 PM',
      preferredArea: 'Negombo',
      pickupRadius: '5 km',
      foodTypes: ['Cooked Meals', 'Rice & Curry'],
      availableToday: true,
      availableDays: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
      ],
    },

    updatePickupPreferences: (updates) =>
      set((state) => ({
        pickupPreferences: {
          ...state.pickupPreferences,
          ...updates,
        },
      })),

    // ── Notification Preferences ──

    notificationPreferences: {
      newPickupAssigned: true,
      pickupReminder: true,
      routeUpdates: true,
      statusUpdates: true,
      deliveryCompleted: true,
      activityUpdates: true,
      issueUpdates: true,
      announcements: false,
      generalNotifications: true,
      importantAlerts: true,
    },

    updateNotificationPreferences: (updates) =>
      set((state) => ({
        notificationPreferences: {
          ...state.notificationPreferences,
          ...updates,
        },
      })),

    // ── Activities ──

    activities: [
      {
        id: 'act-1',
        icon: 'package',
        title: 'Pickup Assigned',
        description:
          'A new pickup was assigned to you from Green Leaf Bakery.',
        timestamp: '4:00 PM',
        status: 'ASSIGNED',
      },
    ],

    addActivity: (item) =>
      set((state) => ({
        activities: [
          {
            ...item,
            id: `act-${Date.now()}`,
          },
          ...state.activities,
        ],
      })),

    // ── Notifications ──

    notifications: [
      {
        id: 'n1',
        type: 'pickup',
        title: 'New pickup assigned',
        description:
          'Green Leaf Bakery has assigned a new pickup request.',
        time: '2 mins ago',
        read: false,
        navigateTo: '/volunteer/pickup-details',
      },

      {
        id: 'n2',
        type: 'reminder',
        title: 'Pickup reminder',
        description:
          'Please collect the donation before 5:00 PM.',
        time: '15 mins ago',
        read: false,
        navigateTo: '/volunteer/pickup-details',
      },

      {
        id: 'n3',
        type: 'route',
        title: 'Route updated',
        description:
          'Traffic has increased on your current route.',
        time: '22 mins ago',
        read: true,
        navigateTo: '/volunteer/route',
      },

      {
        id: 'n4',
        type: 'collection',
        title: 'Collection recorded',
        description:
          'Your pickup has been successfully confirmed.',
        time: '1 hour ago',
        read: true,
        navigateTo: '/volunteer/confirmation',
      },
    ],

    addNotification: (item) =>
      set((state) => ({
        notifications: [
          {
            ...item,
            id: `notif-${Date.now()}`,
          },
          ...state.notifications,
        ],
      })),

    markNotificationRead: (id) =>
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id
            ? {
                ...n,
                read: true,
              }
            : n
        ),
      })),

    markAllNotificationsRead: () =>
      set((state) => ({
        notifications: state.notifications.map((n) => ({
          ...n,
          read: true,
        })),
      })),

    // ── Support Requests ──

    supportRequests: [],

    addSupportRequest: (type, description) =>
      set((state) => ({
        supportRequests: [
          ...state.supportRequests,
          {
            id: `sr-${Date.now()}`,
            type,
            description,
            timestamp:
              new Date().toLocaleTimeString(),
          },
        ],
      })),
  })
);