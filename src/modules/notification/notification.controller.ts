import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import {
  NotificationResponse,
  SendNotificationRequest,
  SendNotificationResponse,
} from './dto/send-notification.dto';
import { Notification } from './entities/notification.entity';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationsService: NotificationService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async send(
    @Body() sendNotificationRequest: SendNotificationRequest,
  ): Promise<SendNotificationResponse> {
    const notifications = await this.notificationsService.create(
      sendNotificationRequest,
    );

    return {
      notifications: notifications.map(
        (n) => n.toJSON() as NotificationResponse,
      ),
    };
  }

  @Get(':userId/channels/:channel')
  findAll(
    @Param('userId') userId: string,
    @Param('channel') channel: string,
  ): Promise<Notification[]> {
    return this.notificationsService.findAll(userId, channel);
  }
}
