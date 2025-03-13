import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { NotificationType } from '../../../common/enums/notification-type.enum';

export class SendNotificationRequest {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  companyId: string;

  @IsEnum(NotificationType)
  type: NotificationType;
}

export interface SendNotificationResponse {
  notifications: NotificationResponse[];
}

export interface NotificationResponse {
  userId: string;
  companyId: string;
  type: string;
  channel: string;
  subject?: string;
  content?: string;
}
