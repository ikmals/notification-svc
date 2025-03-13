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
  SendNotificationRequest,
  SendNotificationResponse,
} from './dto/send-notification.dto';
import { Notification } from './entities/notification.entity';
import { NotificationResponse } from './dto/notification.dto';
import {
  GetNotificationsRequest,
  GetNotificationsResponse,
} from './dto/get-notifications.dto';

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
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async get(
    @Param() params: GetNotificationsRequest,
  ): Promise<GetNotificationsResponse> {
    const notifications = await this.notificationsService.findAll(
      params.userId,
      params.channel,
    );
    return {
      notifications: notifications.map(
        (n) => n.toJSON() as NotificationResponse,
      ),
    };
  }
}
