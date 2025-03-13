import { Injectable, Logger } from '@nestjs/common';
import { ChannelProvider } from '../../../common/interfaces/channel.interface';
import { Message } from '../../../common/interfaces/template.interface';

@Injectable()
export class EmailChannel implements ChannelProvider {
  private readonly logger = new Logger(EmailChannel.name);

  send(userId: string, companyId: string, message: Message): void {
    this.logger.log(
      `[EMAIL] Sending notification to user ${userId} in company ${companyId}. Subject: ${message.subject}, Content: ${message.content}`,
    );
  }
}
