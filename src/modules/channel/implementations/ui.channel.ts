import { Injectable, Logger } from '@nestjs/common';
import { Channel } from '../channel.interface';
import { NotificationType } from '../../../common/enums/notification-type.enum';

@Injectable()
export class UIChannel implements Channel {
  private readonly logger = new Logger(UIChannel.name);

  async send(
    userId: string,
    companyId: string,
    notificationType: NotificationType,
  ): Promise<void> {
    this.logger.log(
      `[UI] Sending notification to user ${userId} for ${notificationType} in company ${companyId}`,
    );
  }
}
