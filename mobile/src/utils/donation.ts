import type { Donation, DonationStatus, DonationTimelineItem } from '@/types/donation';

const statusLabels: Record<DonationStatus, string> = {
  published: 'Published',
  accepted: 'Accepted',
  assigned: 'Volunteer Assigned',
  pickup: 'Pickup in Progress',
  collected: 'Collected',
};

export function getDonationStatusLabel(status: DonationStatus): string {
  return statusLabels[status];
}

export function getDonationTimeLabel(donation: Donation): string {
  if (donation.status === 'collected') {
    return donation.collectedAt ? `Collected ${donation.collectedAt}` : 'Collection complete';
  }

  return `Pickup before ${donation.pickupDeadline.replace(/^Today,\s*/i, '')}`;
}

const stages: { status: DonationStatus; title: string }[] = [
  { status: 'published', title: 'Donation Published' },
  { status: 'accepted', title: 'NGO Accepted' },
  { status: 'assigned', title: 'Volunteer Assigned' },
  { status: 'pickup', title: 'Pickup in Progress' },
  { status: 'collected', title: 'Food Collected' },
];

export function getDonationTimeline(status: DonationStatus): DonationTimelineItem[] {
  const currentStage = stages.findIndex((stage) => stage.status === status);

  return stages.map((stage, index) => ({
    title: stage.title,
    status:
      status === 'collected' || index < currentStage
        ? 'completed'
        : index === currentStage
          ? 'current'
          : 'pending',
  }));
}
