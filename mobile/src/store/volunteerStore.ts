import { create } from 'zustand';

export type PickupStatus = 'PENDING' | 'ACCEPTED' | 'ON_WAY' | 'ARRIVED' | 'COLLECTED' | 'DELIVERED';

interface VolunteerProfile {
  volunteerId: string;
  fullName: string;
  phone: string;
  email: string;
  location: string;
  avatarUrl: string | null;
}

interface VolunteerState {
  pickupStatus: PickupStatus;
  setPickupStatus: (status: PickupStatus) => void;
  profile: VolunteerProfile;
  updateProfile: (profile: Partial<VolunteerProfile>) => void;
}

export const useVolunteerStore = create<VolunteerState>((set) => ({
  pickupStatus: 'ON_WAY',
  setPickupStatus: (status) => set({ pickupStatus: status }),
  profile: {
    volunteerId: 'VOL-10293',
    fullName: 'Jane Doe',
    phone: '+94 77 123 4567',
    email: 'jane.doe@example.com',
    location: 'Colombo, Sri Lanka',
    avatarUrl: null,
  },
  updateProfile: (updates) => set((state) => ({
    profile: { ...state.profile, ...updates }
  })),
}));
