export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  time: string;
  kind: 'assigned' | 'accepted' | 'published' | 'collected';
  unread: boolean;
  donationId: string;
};
