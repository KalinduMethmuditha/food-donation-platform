export type DonationStatus =
  | 'published'
  | 'accepted'
  | 'assigned'
  | 'pickup'
  | 'arrived'
  | 'collected'
  | 'delivered'
  | 'cancelled';

export type DonationStatusLog = {
  id: string;
  status: DonationStatus;
  note?: string;
  createdAt: string;
};

export type DonationDraft = {
  foodType: string;
  quantity: string;
  unit: string;
  description: string;
  pickupLocation: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  pickupDeadline: string;
};

export type Donation = Omit<DonationDraft, 'quantity'> & {
  id: string;
  quantity: number;
  status: DonationStatus;
  createdAt?: string;
  statusLogs?: DonationStatusLog[];
  collectedAt?: string;
  deliveredAt?: string;
  ngoName?: string;
  volunteerName?: string;
};

export type DonationTimelineItem = {
  title: string;
  status: 'completed' | 'current' | 'pending';
  time?: string;
};
