import { Message } from '../template/template.interface';

export interface ChannelProvider {
  send(userId: string, companyId: string, message: Message): void;
}
