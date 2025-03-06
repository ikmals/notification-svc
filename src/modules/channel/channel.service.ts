import { Injectable } from '@nestjs/common';
import { Channel } from './channel.interface';
import { EmailChannel } from './implementations/email.channel';
import { UIChannel } from './implementations/ui.channel';
import { ChannelType } from '../../common/enums/channel-type.enum';

@Injectable()
export class ChannelService {
  private readonly channelMap: Record<ChannelType, Channel>;

  constructor(
    private readonly emailChannel: EmailChannel,
    private readonly uiChannel: UIChannel,
  ) {
    this.channelMap = {
      [ChannelType.EMAIL]: this.emailChannel,
      [ChannelType.UI]: this.uiChannel,
    };
  }

  getChannel(channelType: ChannelType): Channel {
    return this.channelMap[channelType];
  }
}
