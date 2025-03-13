export interface NotificationResponse {
  userId: string;
  companyId: string;
  type: string;
  channel: string;
  subject?: string;
  content?: string;
}
