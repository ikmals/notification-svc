import { Message } from '../template/template.interface';

export interface Channel {
  send(userId: string, companyId: string, message: Message): void;
}
