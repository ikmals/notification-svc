import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  create(createNotificationDto: CreateNotificationDto) {
    return `This action sends a new ${createNotificationDto.type} notification for user ${createNotificationDto.userId} in ${createNotificationDto.companyId}`;
  }

  findAll(userId: string, channel: string) {
    return `Fetching notifications for user ${userId} and channel ${channel}`;
  }
}
