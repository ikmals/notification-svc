import { Injectable, Logger } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationType } from '../../common/enums/notification-type.enum';
import { ChannelType } from '../../common/enums/channel-type.enum';
import { UserService } from '../user/user.service';
import { CompanyService } from '../company/company.service';
import { ChannelService } from '../channel/channel.service';

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
    private readonly channelService: ChannelService,
  ) {}

  async create(dto: CreateNotificationDto) {
    const channelTypes =
      NotificationService.NOTIFICATION_CHANNELS[dto.type] || [];

    if (channelTypes.length === 0) {
      this.logger.warn(`No channel types found for: ${dto.type}`);
      return;
    }

    const promises: Promise<void>[] = [];
    for (const channelType of channelTypes) {
      if (this.isSubscribed(dto, channelType)) {
        const channel = this.channelService.getChannel(channelType);

        if (!channel) {
          this.logger.warn(`No channel found for: ${channelType}`);
          return;
        }

        promises.push(channel.send(dto.userId, dto.companyId, dto.type));
      }
    }

    await Promise.all(promises);

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
