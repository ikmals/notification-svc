import { NotificationType } from '../../common/enums/notification-type.enum';

export interface Channel {
  send(
    userId: string,
    companyId: string,
    notificationType: NotificationType,
  ): Promise<void>;
}
