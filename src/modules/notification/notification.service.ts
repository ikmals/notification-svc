import { Injectable, Logger } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ChannelType } from '../../common/enums/channel-type.enum';
import { UserService } from '../user/user.service';
import { CompanyService } from '../company/company.service';
import { ChannelService } from '../channel/channel.service';
import { TemplateService } from '../template/template.service';
import { Variable } from '../template/template.interface';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly userService: UserService,
    private readonly companyService: CompanyService,
    private readonly channelService: ChannelService,
    private readonly templateService: TemplateService,
  ) {}

  async create(dto: CreateNotificationDto) {
    const channelTypes = this.channelService.getChannelTypes(dto.type);
    if (channelTypes.length === 0) {
      this.logger.warn(`No channel types found for: ${dto.type}`);
      return;
    }

    const company = this.companyService.getCompanyById(dto.companyId);
    const user = this.userService.getUserById(dto.userId);

    const promises: Promise<void>[] = [];
    for (const channelType of channelTypes) {
      if (this.isSubscribed(dto, channelType)) {
        const channel = this.channelService.getChannel(channelType);
        if (!channel) {
          this.logger.warn(`No channel found for: ${channelType}`);
          return;
        }

        const templateVariables: Variable = {
          firstName: user.name,
          companyName: company.name,
        };

        const template = this.templateService.get(
          company,
          channelType,
          dto.type,
        );

        const message = this.templateService.render(
          template,
          templateVariables,
        );

        promises.push(channel.send(dto.userId, dto.companyId, dto.type));
      }
    }

    await Promise.all(promises);

    return `This action sends a new ${dto.type} notification for user ${dto.userId} in ${dto.companyId}`;
  }

  findAll(userId: string, channel: string) {
    return `Fetching notifications for user ${userId} and channel ${channel}`;
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
