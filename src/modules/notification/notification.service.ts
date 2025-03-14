import { Injectable, Logger } from '@nestjs/common';
import { SendNotificationRequest } from './dto/send-notification.dto';
import { ChannelType } from '../../common/enums/channel-type.enum';
import { UserService } from '../user/user.service';
import { CompanyService } from '../company/company.service';
import { ChannelService } from '../channel/channel.service';
import { TemplateService } from '../template/template.service';
import { Variable } from '../../common/interfaces/template.interface';
import { NotificationRepository } from './notification.repository';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly userService: UserService,
    private readonly companyService: CompanyService,
    private readonly channelService: ChannelService,
    private readonly templateService: TemplateService,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async create(dto: SendNotificationRequest): Promise<Notification[]> {
    const channelTypes = this.channelService.getChannelTypes(dto.type);
    const company = this.companyService.getCompanyById(dto.companyId);
    const user = this.userService.getUserById(dto.userId);

    const notifications = [];
    for (const channelType of channelTypes) {
      if (this.isSubscribed(dto, channelType)) {
        const channelProvider =
          this.channelService.getChannelProvider(channelType);

        const template = this.templateService.get(
          company,
          channelType,
          dto.type,
        );
        const variable: Variable = {
          firstName: user.name,
          companyName: company.name,
        };
        const message = this.templateService.render(template, variable);

        channelProvider.send(dto.userId, dto.companyId, message);

        notifications.push(
          this.notificationRepository.create(
            user.id,
            company.id,
            dto.type,
            channelType,
            message.subject,
            message.content,
          ),
        );
      }
    }

    return await Promise.all(notifications);
  }

  async findAll(userId: string, channel: string) {
    return this.notificationRepository.find({ userId, channel });
  }

  private isSubscribed(
    dto: SendNotificationRequest,
    channel: ChannelType,
  ): boolean {
    return (
      this.companyService.isSubscribedToChannel(dto.companyId, channel) &&
      this.userService.isSubscribedToChannel(dto.userId, channel)
    );
  }
}
