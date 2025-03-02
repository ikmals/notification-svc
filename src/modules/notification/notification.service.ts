import { Injectable, Logger } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationType } from '../../common/enums/notification-type.enum';
import { ChannelType } from '../../common/enums/channel-type.enum';
import { UserService } from '../users/user.service';
import { CompanyService } from '../company/company.service';

@Injectable()
export class NotificationService {
  private static readonly NOTIFICATION_CHANNELS: Record<
    NotificationType,
    ChannelType[]
  > = {
    [NotificationType.LEAVE_BALANCE_REMINDER]: [ChannelType.UI],
    [NotificationType.MONTHLY_PAYSLIP]: [ChannelType.EMAIL],
    [NotificationType.HAPPY_BIRTHDAY]: [ChannelType.EMAIL, ChannelType.UI],
  };
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly userService: UserService,
    private readonly companyService: CompanyService,
  ) {}

  create(dto: CreateNotificationDto) {
    const channels = NotificationService.NOTIFICATION_CHANNELS[dto.type] || [];

    if (channels.length === 0) {
      this.logger.warn(`No channels found for: ${dto.type}`);
      return;
    }

    for (const channel of channels) {
      if (this.isSubscribed(dto, channel)) {
        this.logger.log(`Sending a notification via ${channel}`);
      }
    }

    return `This action sends a new ${dto.type} notification for user ${dto.userId} in ${dto.companyId}`;
  }

  findAll(userId: string, channel: string) {
    return `Fetching notifications for user ${userId} and channel ${channel}`;
  }

  private isSubscribed(
    dto: CreateNotificationDto,
    channel: ChannelType,
  ): boolean {
    return (
      this.companyService.isSubscribedToChannel(dto.companyId, channel) &&
      this.userService.isSubscribedToChannel(dto.userId, channel)
    );
  }
}
