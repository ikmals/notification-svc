import { Injectable, Logger } from '@nestjs/common';
import { ChannelProvider } from '../../../common/interfaces/channel.interface';
import { Message } from '../../../common/interfaces/template.interface';

@Injectable()
export class UIChannel implements ChannelProvider {
  private readonly logger = new Logger(UIChannel.name);

  send(userId: string, companyId: string, message: Message): void {
    this.logger.log(
      `[UI] Sending notification to user ${userId} in company ${companyId}. Content: ${message.content}`,
    );
  }
}
