import { Injectable, NotFoundException } from '@nestjs/common';
import { ChannelType } from '../../common/enums/channel-type.enum';
import { User } from '../../common/interfaces/user.interface';

@Injectable()
export class UserService {
  private users: User[] = [
    {
      id: '1',
      name: 'Alpha',
      email: 'alpha@example.com',
      subscribedChannels: [ChannelType.EMAIL, ChannelType.UI],
    },
    {
      id: '2',
      name: 'Beta',
      email: 'beta@example.com',
      subscribedChannels: [ChannelType.UI],
    },
    {
      id: '3',
      name: 'Gamma',
      email: 'gamma@example.com',
      subscribedChannels: [ChannelType.EMAIL],
    },
  ];

  getUserById(userId: string): User {
    const user = this.users.find((user) => user.id === userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  isSubscribedToChannel(userId: string, channel: ChannelType): boolean {
    const user = this.getUserById(userId);
    return user.subscribedChannels.includes(channel);
  }
}
