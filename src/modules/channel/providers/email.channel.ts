import { Injectable, Logger } from '@nestjs/common';
import { Channel } from '../channel.interface';
import { Message } from '../../template/template.interface';

@Injectable()
export class EmailChannel implements Channel {
  private readonly logger = new Logger(EmailChannel.name);

  send(userId: string, companyId: string, message: Message): void {
    this.logger.log(
      `[EMAIL] Sending notification to user ${userId} in company ${companyId}. Subject: ${message.subject}, Content: ${message.content}`,
    );
  }
}
