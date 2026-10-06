import { create } from 'zustand';
import { mockActivePickup, mockNotifications, mockVolunteer } from '@/data/mockVolunteerData';

export type PickupStatus = 'ASSIGNED' | 'ON THE WAY' | 'ARRIVED' | 'COLLECTED' | 'DELIVERED';

export interface ActivityLog {
  id: string;
  title: string;
  description: string;
  time: string;
  status: PickupStatus | 'INFO' | 'ISSUE';
  icon: any;
}

export interface NotificationInfo {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'pickup' | 'reminder' | 'route' | 'collection' | 'issue' | 'update';
  navigateTo: string;
}

export interface UserProfile {
  fullName: string;
  phone: string;
  email: string;
  location: string;
  volunteerId: string;
  joinedDate: string;
  avatarUrl: string | null;
}

export interface PickupPreferences {
  preferredStartTime: string;
  preferredEndTime: string;
  preferredArea: string;
  pickupRadius: string;
  foodTypes: string[];
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
}

interface VolunteerState {
  // Authentication State
  isAuthenticated: boolean;
  logout: () => void;
  login: () => void;

  // Global Profile State
  isAvailable: boolean;
  toggleAvailability: () => void;
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  
  pickupPreferences: PickupPreferences;
  updatePickupPreferences: (updates: Partial<PickupPreferences>) => void;

  notificationPreferences: NotificationPreferences;
  updateNotificationPreferences: (updates: Partial<NotificationPreferences>) => void;
  
  // Current Pickup State
  pickupStatus: PickupStatus;
  collectedTime: string | null;
  deliveredTime: string | null;
  setPickupStatus: (status: PickupStatus) => void;
  
  // Activity History
  activities: ActivityLog[];
  addActivity: (title: string, description: string, status: ActivityLog['status'], icon: any) => void;
  addUpdate: (text: string) => void;
  reportIssue: (issueType: string, description?: string) => void;
  
  // Notifications
  notifications: NotificationInfo[];
  addNotification: (title: string, description: string, type: NotificationInfo['type'], navigateTo: string) => void;
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;
}

const getCurrentTime = () => {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

export const useVolunteerStore = create<VolunteerState>((set, get) => ({
  isAuthenticated: true,
  logout: () => set({ isAuthenticated: false }),
  login: () => set({ isAuthenticated: true }),

  isAvailable: true,
  toggleAvailability: () => set((state) => ({ isAvailable: !state.isAvailable })),

  profile: {
    fullName: mockVolunteer.fullName,
    phone: '+94 71 234 5678',
    email: 'nimsara@example.com',
    location: mockVolunteer.location,
    volunteerId: mockVolunteer.id,
    joinedDate: 'January 2026',
    avatarUrl: null,
  },
  updateProfile: (updates) => set((state) => ({ profile: { ...state.profile, ...updates } })),

  pickupPreferences: {
    preferredStartTime: '04:00 PM',
    preferredEndTime: '06:00 PM',
    preferredArea: 'Negombo',
    pickupRadius: '5 km',
    foodTypes: ['Cooked Meals', 'Bakery Items'],
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  },
  updatePickupPreferences: (updates) => set((state) => ({ pickupPreferences: { ...state.pickupPreferences, ...updates } })),

  notificationPreferences: {
    newPickupAssigned: true,
    pickupReminder: true,
    routeUpdates: true,
    statusUpdates: true,
    deliveryCompleted: true,
    activityUpdates: false,
    issueUpdates: true,
    announcements: false,
  },
  updateNotificationPreferences: (updates) => set((state) => ({ notificationPreferences: { ...state.notificationPreferences, ...updates } })),

  pickupStatus: 'ASSIGNED',
  collectedTime: null,
  deliveredTime: null,

  setPickupStatus: (status) => {
    const time = getCurrentTime();
    set((state) => ({
      pickupStatus: status,
      collectedTime: status === 'COLLECTED' ? time : state.collectedTime,
      deliveredTime: status === 'DELIVERED' ? time : state.deliveredTime,
    }));
    
    // Auto-generate activities and notifications based on status
    let title = '';
    let desc = '';
    let type: NotificationInfo['type'] = 'pickup';
    let nav = '/volunteer/dashboard';
    let icon = 'clock';

    switch (status) {
      case 'ON THE WAY':
        title = 'Pickup started';
        desc = `Volunteer is on the way to ${mockActivePickup.donor}.`;
        type = 'route';
        nav = '/volunteer/route';
        icon = 'route';
        break;
      case 'ARRIVED':
        title = 'Volunteer arrived';
        desc = `You have arrived at the pickup location.`;
        type = 'pickup';
        nav = '/volunteer/collection-status';
        icon = 'pin';
        break;
      case 'COLLECTED':
        title = 'Collection recorded';
        desc = `${mockActivePickup.quantity} have been collected.`;
        type = 'collection';
        nav = '/volunteer/confirmation';
        icon = 'package';
        break;
      case 'DELIVERED':
        title = 'Delivery completed';
        desc = 'The donation delivery has been completed successfully.';
        type = 'collection';
        nav = '/volunteer/confirmation';
        icon = 'check-circle';
        break;
    }

    if (title) {
      get().addActivity(title, desc, status, icon);
      // Respect notification preferences where possible (simplified for mock)
      if (get().notificationPreferences.statusUpdates) {
        get().addNotification(title, desc, type, nav);
      }
    }
  },

  activities: [
    {
      id: 'a1',
      title: 'Pickup assigned',
      description: `${mockActivePickup.donor} assigned a new pickup.`,
      time: '2 mins ago',
      status: 'ASSIGNED',
      icon: 'package',
    }
  ],

  addActivity: (title, description, status, icon) => {
    const newActivity: ActivityLog = {
      id: Math.random().toString(36).substring(7),
      title,
      description,
      time: 'Just now',
      status,
      icon,
    };
    set((state) => ({ activities: [newActivity, ...state.activities] }));
  },

  addUpdate: (text) => {
    get().addActivity('Update added', text, 'INFO', 'message');
    if (get().notificationPreferences.activityUpdates) {
      get().addNotification('Pickup update added', `${get().profile.fullName} added a new pickup update.`, 'update', '/volunteer/activity');
    }
  },

  reportIssue: (issueType, description) => {
    const descText = description ? `${issueType}: ${description}` : `A ${issueType.toLowerCase()} issue was reported for ${mockActivePickup.donor}.`;
    get().addActivity('Issue reported', descText, 'ISSUE', 'alert-triangle');
    if (get().notificationPreferences.issueUpdates) {
      get().addNotification('Issue reported', descText, 'issue', '/volunteer/activity');
    }
  },

  notifications: mockNotifications.map(n => ({
    ...n,
    read: false,
    type: n.type as NotificationInfo['type'],
  })),

  addNotification: (title, description, type, navigateTo) => {
    const newNotif: NotificationInfo = {
      id: Math.random().toString(36).substring(7),
      title,
      description,
      time: 'Just now',
      read: false,
      type,
      navigateTo,
    };
    set((state) => ({ notifications: [newNotif, ...state.notifications] }));
  },

  markAllNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),

  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),
}));
