import type { Donation, DonationStatus, DonationStatusLog, DonationTimelineItem } from '@/types/donation';
import { formatDateTime } from '@/utils/dateTime';

const statusLabels: Record<DonationStatus, string> = {
  published: 'Published',
  accepted: 'Accepted',
  assigned: 'Volunteer Assigned',
  pickup: 'Pickup in Progress',
  collected: 'Collected',
  cancelled: 'Cancelled',
};

export function getDonationStatusLabel(status: DonationStatus): string {
  return statusLabels[status];
}

export function getDonationTimeLabel(donation: Donation): string {
  if (donation.status === 'collected') {
    if (!donation.collectedAt) return 'Collection complete';
    const collectedAt = formatDateTime(donation.collectedAt);
    return collectedAt === 'Time unavailable' ? 'Collection complete' : `Collected ${collectedAt}`;
  }

  const deadline = formatDateTime(donation.pickupDeadline);
  return deadline === 'Time unavailable' ? 'Pickup time unavailable' : `Pickup before ${deadline}`;
}

const stages: { status: DonationStatus; title: string }[] = [
  { status: 'published', title: 'Donation Published' },
  { status: 'accepted', title: 'NGO Accepted' },
  { status: 'assigned', title: 'Volunteer Assigned' },
  { status: 'pickup', title: 'Pickup in Progress' },
  { status: 'collected', title: 'Food Collected' },
];

export function getDonationTimeline(status: DonationStatus, logs: DonationStatusLog[] = []): DonationTimelineItem[] {
  if (status === 'cancelled') {
    const publishedAt = logs.find((log) => log.status === 'published')?.createdAt;
    const cancelledAt = logs.find((log) => log.status === 'cancelled')?.createdAt;
    return [
      { title: 'Donation Published', status: 'completed', time: publishedAt ? formatDateTime(publishedAt) : undefined },
      { title: 'Donation Cancelled', status: 'current', time: cancelledAt ? formatDateTime(cancelledAt) : undefined },
    ];
  }
  const currentStage = stages.findIndex((stage) => stage.status === status);

  return stages.map((stage, index) => {
    const logTime = logs.find((log) => log.status === stage.status)?.createdAt;
    return {
      title: stage.title,
      time: logTime ? formatDateTime(logTime) : undefined,
      status: status === 'collected' || index < currentStage
        ? 'completed'
        : index === currentStage ? 'current' : 'pending',
    };
  });
}

export const donationActivity: Record<DonationStatus, { title: string; icon: 'arrow-up' | 'check' | 'users' | 'truck' | 'gift' }> = {
  published: { title: 'Donation published', icon: 'arrow-up' },
  accepted: { title: 'Donation accepted', icon: 'check' },
  assigned: { title: 'Volunteer assigned', icon: 'users' },
  pickup: { title: 'Pickup started', icon: 'truck' },
  collected: { title: 'Food collected', icon: 'gift' },
  cancelled: { title: 'Donation cancelled', icon: 'check' },
};

export function getDonationActivity(donations: Donation[]) {
  return donations.flatMap((donation) => (donation.statusLogs ?? []).map((log) => ({
    id: `${donation.id}-${log.id}`,
    donationId: donation.id,
    foodType: donation.foodType,
    status: log.status,
    createdAt: log.createdAt,
    ...donationActivity[log.status],
  }))).sort((a, b) => (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0));
}
