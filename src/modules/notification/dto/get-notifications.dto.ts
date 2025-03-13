import { IsString, IsNotEmpty } from 'class-validator';
import { NotificationResponse } from './notification.dto';

export class GetNotificationsRequest {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  channel: string;
}

export interface GetNotificationsResponse {
  notifications: NotificationResponse[];
}
