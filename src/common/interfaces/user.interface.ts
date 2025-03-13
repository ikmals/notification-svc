import { ChannelType } from '../enums/channel-type.enum';

export interface User {
  id: string;
  name: string;
  email: string;
  subscribedChannels: ChannelType[];
}
