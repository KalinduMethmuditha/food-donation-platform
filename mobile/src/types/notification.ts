export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  time: string;
  kind: 'assigned' | 'accepted' | 'published' | 'pickup' | 'arrived' | 'collected' | 'delivered' | 'cancelled';
  donationId: string;
};
