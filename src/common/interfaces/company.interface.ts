import { ChannelType } from '../enums/channel-type.enum';

export interface Company {
  id: string;
  name: string;
  subscribedChannels: ChannelType[];
}
