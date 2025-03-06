import { Injectable } from '@nestjs/common';
import { Channel } from './channel.interface';
import { EmailChannel } from './implementations/email.channel';
import { UIChannel } from './implementations/ui.channel';
import { ChannelType } from '../../common/enums/channel-type.enum';
import { NotificationType } from '../../common/enums/notification-type.enum';

@Injectable()
export class ChannelService {
  private readonly CHANNEL_MAP: Record<ChannelType, Channel>;
  private readonly NOTIFICATION_CHANNELS: Record<
    NotificationType,
    ChannelType[]
  > = {
    [NotificationType.LEAVE_BALANCE_REMINDER]: [ChannelType.UI],
    [NotificationType.MONTHLY_PAYSLIP]: [ChannelType.EMAIL],
    [NotificationType.HAPPY_BIRTHDAY]: [ChannelType.EMAIL, ChannelType.UI],
  };

  constructor(
    private readonly emailChannel: EmailChannel,
    private readonly uiChannel: UIChannel,
  ) {
    this.CHANNEL_MAP = {
      [ChannelType.EMAIL]: this.emailChannel,
      [ChannelType.UI]: this.uiChannel,
    };
  }

  getChannel(channelType: ChannelType): Channel {
    return this.CHANNEL_MAP[channelType];
  }

  getChannelTypes(notificationType: NotificationType): ChannelType[] {
    return this.NOTIFICATION_CHANNELS[notificationType] || [];
  }
}
