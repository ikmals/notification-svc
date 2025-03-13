import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { EmailChannel } from './providers/email.channel';
import { UIChannel } from './providers/ui.channel';
import { ChannelType } from '../../common/enums/channel-type.enum';
import { NotificationType } from '../../common/enums/notification-type.enum';

describe('ChannelService', () => {
  let channelService: ChannelService;
  let emailChannel: EmailChannel;
  let uiChannel: UIChannel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelService,
        {
          provide: EmailChannel,
          useValue: { dummy: 'emailChannel' },
        },
        {
          provide: UIChannel,
          useValue: { dummy: 'uiChannel' },
        },
      ],
    }).compile();

    channelService = module.get<ChannelService>(ChannelService);
    emailChannel = module.get<EmailChannel>(EmailChannel);
    uiChannel = module.get<UIChannel>(UIChannel);
  });

  describe('getChannelProvider', () => {
    it('should return the EmailChannel for ChannelType.EMAIL', () => {
      const provider = channelService.getChannelProvider(ChannelType.EMAIL);
      expect(provider).toBe(emailChannel);
    });

    it('should return the UIChannel for ChannelType.UI', () => {
      const provider = channelService.getChannelProvider(ChannelType.UI);
      expect(provider).toBe(uiChannel);
    });

    it('should throw an InternalServerErrorException if provider is not found', () => {
      Object.defineProperty(channelService, 'CHANNEL_PROVIDERS', {
        value: {},
        writable: true,
      });
      expect(() =>
        channelService.getChannelProvider(ChannelType.EMAIL),
      ).toThrow(InternalServerErrorException);
    });
  });

  describe('getChannelTypes', () => {
    it('should return [ChannelType.UI] for LEAVE_BALANCE_REMINDER', () => {
      const types = channelService.getChannelTypes(
        NotificationType.LEAVE_BALANCE_REMINDER,
      );
      expect(types).toEqual([ChannelType.UI]);
    });

    it('should return [ChannelType.EMAIL] for MONTHLY_PAYSLIP', () => {
      const types = channelService.getChannelTypes(
        NotificationType.MONTHLY_PAYSLIP,
      );
      expect(types).toEqual([ChannelType.EMAIL]);
    });

    it('should return [ChannelType.EMAIL, ChannelType.UI] for HAPPY_BIRTHDAY', () => {
      const types = channelService.getChannelTypes(
        NotificationType.HAPPY_BIRTHDAY,
      );
      expect(types).toEqual([ChannelType.EMAIL, ChannelType.UI]);
    });

    it('should throw an InternalServerErrorException if no channel types are found for an unknown notification type', () => {
      const unknownType = 'NON_EXISTENT_TYPE' as NotificationType;
      expect(() => channelService.getChannelTypes(unknownType)).toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw an InternalServerErrorException if the channel types array is empty for a valid notification type', () => {
      Object.defineProperty(channelService, 'NOTIFICATION_CHANNELS', {
        value: {
          ...channelService['NOTIFICATION_CHANNELS'],
          [NotificationType.LEAVE_BALANCE_REMINDER]: [],
        },
        writable: true,
      });
      expect(() =>
        channelService.getChannelTypes(NotificationType.LEAVE_BALANCE_REMINDER),
      ).toThrow(InternalServerErrorException);
    });
  });
});
