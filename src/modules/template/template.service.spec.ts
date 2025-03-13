import { InternalServerErrorException } from '@nestjs/common';
import { TemplateService } from './template.service';
import { NotificationType } from '../../common/enums/notification-type.enum';
import { ChannelType } from '../../common/enums/channel-type.enum';

describe('TemplateService', () => {
  let service: TemplateService;

  beforeEach(() => {
    service = new TemplateService();
  });

  describe('get', () => {
    it('should return the email template for HAPPY_BIRTHDAY', () => {
      const template = service.get(
        {} as any,
        ChannelType.EMAIL,
        NotificationType.HAPPY_BIRTHDAY,
      );
      expect(template).toEqual({
        subject: `Happy Birthday, {{firstName}}!`,
        content: `All of us at {{companyName}} wish you a very happy birthday!`,
      });
    });

    it('should return the UI template for HAPPY_BIRTHDAY', () => {
      const template = service.get(
        {} as any,
        ChannelType.UI,
        NotificationType.HAPPY_BIRTHDAY,
      );
      expect(template).toEqual({
        content: `Happy Birthday, {{firstName}}!`,
      });
    });

    it('should throw an error if no template is defined for a given notification type', () => {
      expect(() =>
        service.get(
          {} as any,
          ChannelType.EMAIL,
          'NON_EXISTENT_TYPE' as NotificationType,
        ),
      ).toThrow(InternalServerErrorException);
    });

    it('should throw an error if no template is defined for a given channel', () => {
      expect(() =>
        service.get(
          {} as any,
          'sms' as ChannelType,
          NotificationType.LEAVE_BALANCE_REMINDER,
        ),
      ).toThrow(InternalServerErrorException);
    });
  });

  describe('render', () => {
    it('should replace placeholders in both subject and content', () => {
      const template = {
        subject: 'Hello {{firstName}}, welcome to {{companyName}}!',
        content: 'Your account has been created.',
      };
      const variables = {
        firstName: 'Alpha',
        companyName: 'Amazon',
      };
      const message = service.render(template, variables);
      expect(message.subject).toEqual('Hello Alpha, welcome to Amazon!');
      expect(message.content).toEqual('Your account has been created.');
    });

    it('should replace missing placeholders with empty string', () => {
      const template = {
        subject: 'Hello {{firstName}}!',
        content: 'Your account at {{companyName}} is active.',
      };
      const variables = {
        firstName: '',
        companyName: '',
      };
      const message = service.render(template, variables);
      expect(message.subject).toEqual('Hello !');
      expect(message.content).toEqual('Your account at  is active.');
    });

    it('should handle multiple occurrences of the same placeholder', () => {
      const template = {
        subject: '{{firstName}}, your name is {{firstName}}',
        content: 'Welcome, {{firstName}} at {{companyName}}.',
      };
      const variables = {
        firstName: 'Alpha',
        companyName: 'Amazon',
      };
      const message = service.render(template, variables);
      expect(message.subject).toEqual('Alpha, your name is Alpha');
      expect(message.content).toEqual('Welcome, Alpha at Amazon.');
    });
  });
});
