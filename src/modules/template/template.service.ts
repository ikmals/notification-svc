import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { NotificationType } from '../../common/enums/notification-type.enum';
import { ChannelType } from '../../common/enums/channel-type.enum';
import { Company } from '../company/company.service';
import { Message, Template, Variable } from './template.interface';

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);

  private static readonly TEMPLATE_MAP: Record<
    NotificationType,
    Record<ChannelType, Template>
  > = {
    [NotificationType.LEAVE_BALANCE_REMINDER]: {
      [ChannelType.EMAIL]: {
        subject: `Leave Balance Reminder from {{companyName}}`,
        content: `Dear {{firstName}}, your leave balance is low. Please review your leave plan.`,
      },
      [ChannelType.UI]: {
        content: `Leave Balance Reminder`,
      },
    },
    [NotificationType.MONTHLY_PAYSLIP]: {
      [ChannelType.EMAIL]: {
        subject: `Your Monthly Payslip from {{companyName}}`,
        content: `Hello {{firstName}}, your payslip is now available.`,
      },
      [ChannelType.UI]: {
        content: `Monthly Payslip Available`,
      },
    },
    [NotificationType.HAPPY_BIRTHDAY]: {
      [ChannelType.EMAIL]: {
        subject: `Happy Birthday, {{firstName}}!`,
        content: `All of us at {{companyName}} wish you a very happy birthday!`,
      },
      [ChannelType.UI]: {
        content: `Happy Birthday, {{firstName}}!`,
      },
    },
  };

  get(
    company: Company,
    channel: ChannelType,
    type: NotificationType,
  ): Template {
    const templatesByType = TemplateService.TEMPLATE_MAP[type];
    if (!templatesByType) {
      this.logger.error(`No template defined for notification type: ${type}`);
      throw new InternalServerErrorException();
    }

    const template = templatesByType[channel];
    if (!template) {
      this.logger.error(
        `No template defined for channel ${channel} and notification type ${type}`,
      );
      throw new InternalServerErrorException();
    }

    return template;
  }

  render(template: Template, variable: Variable): Message {
    const result = {} as Message;
    for (const key of Object.keys(template) as (keyof Message)[]) {
      result[key] = this.replaceVariable(template[key] || '', variable);
    }
    return result;
  }

  private replaceVariable(text: string, variable: Variable): string {
    return text.replace(/{{\s*(\w+)\s*}}/g, (_, key) => variable[key] || '');
  }
}
