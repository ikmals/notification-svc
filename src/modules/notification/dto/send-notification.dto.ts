import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { NotificationType } from '../../../common/enums/notification-type.enum';
import { NotificationResponse } from './notification.dto';

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
