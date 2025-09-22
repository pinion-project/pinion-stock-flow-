export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  category: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
