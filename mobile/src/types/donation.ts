export type DonationStatus =
  | 'published'
  | 'accepted'
  | 'assigned'
  | 'pickup'
  | 'collected';

export type DonationDraft = {
  foodType: string;
  quantity: string;
  unit: string;
  description: string;
  pickupLocation: string;
  pickupDeadline: string;
};

export type Donation = Omit<DonationDraft, 'quantity'> & {
  id: string;
  quantity: number;
  status: DonationStatus;
  collectedAt?: string;
  ngoName?: string;
  volunteerName?: string;
};

export type DonationTimelineItem = {
  title: string;
  status: 'completed' | 'current' | 'pending';
  time?: string;
};
