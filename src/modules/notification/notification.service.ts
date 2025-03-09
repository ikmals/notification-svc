import { Injectable, Logger } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ChannelType } from '../../common/enums/channel-type.enum';
import { UserService } from '../user/user.service';
import { CompanyService } from '../company/company.service';
import { ChannelService } from '../channel/channel.service';
import { TemplateService } from '../template/template.service';
import { Variable } from '../template/template.interface';
import { NotificationRepository } from './notification.repository';

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

  async create(dto: CreateNotificationDto) {
    const channelTypes = this.channelService.getChannelTypes(dto.type);
    if (channelTypes.length === 0) {
      this.logger.warn(`No channel types found for: ${dto.type}`);
      return;
    }

    const company = this.companyService.getCompanyById(dto.companyId);
    const user = this.userService.getUserById(dto.userId);

    for (const channelType of channelTypes) {
      if (this.isSubscribed(dto, channelType)) {
        const channel = this.channelService.getChannel(channelType);

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

        channel.send(dto.userId, dto.companyId, message);

        await this.notificationRepository.create(
          user.id,
          company.id,
          dto.type,
          channelType,
          message.subject,
          message.content,
        );
      }
    }

    return `This action sends a new ${dto.type} notification for user ${dto.userId} in ${dto.companyId}`;
  }

  async findAll(userId: string, channel: string) {
    return this.notificationRepository.find({ userId, channel });
  }

  private isSubscribed(
    dto: CreateNotificationDto,
    channel: ChannelType,
  ): boolean {
    return (
      this.companyService.isSubscribedToChannel(dto.companyId, channel) &&
      this.userService.isSubscribedToChannel(dto.userId, channel)
    );
  }
}
