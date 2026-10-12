import { create } from 'zustand';

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

type AuthenticatedVolunteer = {
  id: number;
  name: string;
  email: string;
  created_at?: string;
  phone?: string | null;
  location?: string | null;
  avatar_url?: string | null;
  pickup_preferences?: Partial<PickupPreferences> | null;
  notification_preferences?: Partial<NotificationPreferences> | null;
};

type VolunteerState = {
  profile: VolunteerProfile;
  pickupPreferences: PickupPreferences;
  notificationPreferences: NotificationPreferences;
  setAuthenticatedVolunteer: (user: AuthenticatedVolunteer) => void;
  updateProfile: (updates: Partial<VolunteerProfile>) => void;
  updatePickupPreferences: (updates: Partial<PickupPreferences>) => void;
  updateNotificationPreferences: (updates: Partial<NotificationPreferences>) => void;
};

const defaultPickupPreferences: PickupPreferences = {
  preferredStartTime: '4:00 PM',
  preferredEndTime: '6:00 PM',
  preferredArea: '',
  pickupRadius: '5 km',
  foodTypes: [],
  availableToday: false,
  availableDays: [],
};

const defaultNotificationPreferences: NotificationPreferences = {
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
};

export const useVolunteerStore = create<VolunteerState>((set) => ({
  profile: {
    volunteerId: '',
    fullName: '',
    phone: '',
    email: '',
    location: '',
    avatarUrl: null,
    joinedDate: '',
  },
  pickupPreferences: defaultPickupPreferences,
  notificationPreferences: defaultNotificationPreferences,
  setAuthenticatedVolunteer: (user) => set(() => ({
    profile: {
      volunteerId: String(user.id),
      fullName: user.name,
      phone: user.phone ?? '',
      email: user.email,
      location: user.location ?? '',
      avatarUrl: user.avatar_url ?? null,
      joinedDate: user.created_at
        ? new Date(user.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
        : '',
    },
    pickupPreferences: {
      ...defaultPickupPreferences,
      ...(user.pickup_preferences ?? {}),
    },
    notificationPreferences: {
      ...defaultNotificationPreferences,
      ...(user.notification_preferences ?? {}),
    },
  })),
  updateProfile: (updates) => set((state) => ({
    profile: { ...state.profile, ...updates },
  })),
  updatePickupPreferences: (updates) => set((state) => ({
    pickupPreferences: { ...state.pickupPreferences, ...updates },
  })),
  updateNotificationPreferences: (updates) => set((state) => ({
    notificationPreferences: { ...state.notificationPreferences, ...updates },
  })),
}));
