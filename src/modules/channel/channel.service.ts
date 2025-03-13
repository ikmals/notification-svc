import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ChannelProvider } from '../../common/interfaces/channel.interface';
import { EmailChannel } from './providers/email.channel';
import { UIChannel } from './providers/ui.channel';
import { ChannelType } from '../../common/enums/channel-type.enum';
import { NotificationType } from '../../common/enums/notification-type.enum';

@Injectable()
export class ChannelService {
  private readonly CHANNEL_PROVIDERS: Record<ChannelType, ChannelProvider>;
  private readonly NOTIFICATION_CHANNELS: Record<
    NotificationType,
    ChannelType[]
  > = {
    [NotificationType.LEAVE_BALANCE_REMINDER]: [ChannelType.UI],
    [NotificationType.MONTHLY_PAYSLIP]: [ChannelType.EMAIL],
    [NotificationType.HAPPY_BIRTHDAY]: [ChannelType.EMAIL, ChannelType.UI],
  };
  private readonly logger = new Logger(ChannelService.name);

  constructor(
    private readonly emailChannel: EmailChannel,
    private readonly uiChannel: UIChannel,
  ) {
    this.CHANNEL_PROVIDERS = {
      [ChannelType.EMAIL]: this.emailChannel,
      [ChannelType.UI]: this.uiChannel,
    };
  }

  getChannelProvider(channelType: ChannelType): ChannelProvider {
    const channelProvider = this.CHANNEL_PROVIDERS[channelType];
    if (!channelProvider) {
      this.logger.error(
        `No channel provider found for channel type: ${channelType}`,
      );
      throw new InternalServerErrorException();
    }

    return channelProvider;
  }

  getChannelTypes(notificationType: NotificationType): ChannelType[] {
    const channelTypes = this.NOTIFICATION_CHANNELS[notificationType] || [];
    if (channelTypes.length === 0) {
      this.logger.error(
        `No channel types found for notification type: ${notificationType}`,
      );
      throw new InternalServerErrorException();
    }

    return channelTypes;
  }
}
