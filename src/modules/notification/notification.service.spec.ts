import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { SendNotificationRequest } from './dto/send-notification.dto';
import { ChannelType } from '../../common/enums/channel-type.enum';
import { UserService } from '../user/user.service';
import { CompanyService } from '../company/company.service';
import { ChannelService } from '../channel/channel.service';
import { TemplateService } from '../template/template.service';
import { NotificationRepository } from './notification.repository';
import { NotificationType } from '../../common/enums/notification-type.enum';

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let userService: Partial<UserService>;
  let companyService: Partial<CompanyService>;
  let channelService: Partial<ChannelService>;
  let templateService: Partial<TemplateService>;
  let notificationRepository: Partial<NotificationRepository>;

  const fakeUser = {
    id: 'user1',
    name: 'Alpha',
    subscribedChannels: [ChannelType.EMAIL],
  };
  const fakeCompany = {
    id: 'company1',
    name: 'Amazon',
    subscribedChannels: [ChannelType.EMAIL],
  };
  const fakeTemplate = { subject: 'Test Subject', content: 'Test Content' };
  const fakeRenderedMessage = {
    subject: 'Rendered Subject',
    content: 'Rendered Content',
  };

  beforeEach(async () => {
    userService = {
      getUserById: jest.fn().mockReturnValue(fakeUser),
      isSubscribedToChannel: jest.fn().mockReturnValue(true),
    };

    companyService = {
      getCompanyById: jest.fn().mockReturnValue(fakeCompany),
      isSubscribedToChannel: jest.fn().mockReturnValue(true),
    };

    channelService = {
      getChannelTypes: jest.fn().mockReturnValue([ChannelType.EMAIL]),
      getChannelProvider: jest.fn().mockReturnValue({
        send: jest.fn().mockResolvedValue(undefined),
      }),
    };

    templateService = {
      get: jest.fn().mockReturnValue(fakeTemplate),
      render: jest.fn().mockReturnValue(fakeRenderedMessage),
    };

    notificationRepository = {
      create: jest.fn().mockResolvedValue({}),
      find: jest.fn().mockResolvedValue([{ id: 'notification1' }]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        { provide: UserService, useValue: userService },
        { provide: CompanyService, useValue: companyService },
        { provide: ChannelService, useValue: channelService },
        { provide: TemplateService, useValue: templateService },
        { provide: NotificationRepository, useValue: notificationRepository },
      ],
    }).compile();

    notificationService = module.get<NotificationService>(NotificationService);
  });

  describe('create', () => {
    it('should process notification and call dependencies for subscribed channels', async () => {
      const dto: SendNotificationRequest = {
        userId: fakeUser.id,
        companyId: fakeCompany.id,
        type: NotificationType.HAPPY_BIRTHDAY,
      };

      const result = await notificationService.create(dto);

      expect(channelService.getChannelTypes).toHaveBeenCalledWith(dto.type);
      expect(companyService.getCompanyById).toHaveBeenCalledWith(dto.companyId);
      expect(userService.getUserById).toHaveBeenCalledWith(dto.userId);
      expect(channelService.getChannelProvider).toHaveBeenCalledWith(
        ChannelType.EMAIL,
      );
      expect(templateService.get).toHaveBeenCalledWith(
        fakeCompany,
        ChannelType.EMAIL,
        dto.type,
      );
      expect(templateService.render).toHaveBeenCalledWith(fakeTemplate, {
        firstName: fakeUser.name,
        companyName: fakeCompany.name,
      });
      expect(notificationRepository.create).toHaveBeenCalledWith(
        fakeUser.id,
        fakeCompany.id,
        dto.type,
        ChannelType.EMAIL,
        fakeRenderedMessage.subject,
        fakeRenderedMessage.content,
      );
      expect(result).toEqual([{}]);
    });

    describe('error cases', () => {
      const dto: SendNotificationRequest = {
        userId: fakeUser.id,
        companyId: fakeCompany.id,
        type: NotificationType.HAPPY_BIRTHDAY,
      };

      const COMMON_ERROR_MESSAGE = 'An error occurred';

      const throwCommonError = () => {
        throw new Error(COMMON_ERROR_MESSAGE);
      };

      it('should throw an exception if channelService.getChannelProvider throws an exception', async () => {
        (channelService.getChannelProvider as jest.Mock).mockImplementationOnce(
          throwCommonError,
        );
        await expect(notificationService.create(dto)).rejects.toThrow(
          COMMON_ERROR_MESSAGE,
        );
      });

      it('should throw an exception if templateService.get throws an exception', async () => {
        (templateService.get as jest.Mock).mockImplementationOnce(
          throwCommonError,
        );
        await expect(notificationService.create(dto)).rejects.toThrow(
          COMMON_ERROR_MESSAGE,
        );
      });

      it('should throw an exception if templateService.render throws an exception', async () => {
        (templateService.render as jest.Mock).mockImplementationOnce(
          throwCommonError,
        );
        await expect(notificationService.create(dto)).rejects.toThrow(
          COMMON_ERROR_MESSAGE,
        );
      });

      it('should throw an exception if channelService.getChannelTypes throws an exception', async () => {
        (channelService.getChannelTypes as jest.Mock).mockImplementationOnce(
          throwCommonError,
        );
        await expect(notificationService.create(dto)).rejects.toThrow(
          COMMON_ERROR_MESSAGE,
        );
      });

      it('should throw an exception if companyService.getCompanyById throws an exception', async () => {
        (companyService.getCompanyById as jest.Mock).mockImplementationOnce(
          throwCommonError,
        );
        await expect(notificationService.create(dto)).rejects.toThrow(
          COMMON_ERROR_MESSAGE,
        );
      });

      it('should throw an exception if userService.getUserById throws an exception', async () => {
        (userService.getUserById as jest.Mock).mockImplementationOnce(
          throwCommonError,
        );
        await expect(notificationService.create(dto)).rejects.toThrow(
          COMMON_ERROR_MESSAGE,
        );
      });
    });
  });

  describe('findAll', () => {
    it('should call repository find with correct predicate', async () => {
      const userId = fakeUser.id;
      const channel = ChannelType.EMAIL;
      const notifications = await notificationService.findAll(userId, channel);
      expect(notificationRepository.find).toHaveBeenCalledWith({
        userId,
        channel,
      });
      expect(notifications).toEqual([{ id: 'notification1' }]);
    });
  });
});
