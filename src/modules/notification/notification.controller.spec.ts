import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import {
  SendNotificationRequest,
  SendNotificationResponse,
  NotificationResponse,
} from './dto/send-notification.dto';
import { NotificationType } from '../../common/enums/notification-type.enum';

describe('NotificationController', () => {
  let controller: NotificationController;
  let notificationService: NotificationService;

  const mockNotificationService = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
    notificationService = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('send', () => {
    it('should call notificationService.create with provided dto and return a notification response array', async () => {
      const dto: SendNotificationRequest = {
        userId: 'user1',
        companyId: 'company1',
        type: NotificationType.HAPPY_BIRTHDAY,
      };

      const fakeNotification = {
        toJSON: () =>
          ({
            userId: 'user1',
            companyId: 'company1',
            type: NotificationType.HAPPY_BIRTHDAY,
            channel: 'email',
            subject: 'Subject',
            content: 'Content',
          }) as NotificationResponse,
      };

      const expectedResponse: SendNotificationResponse = {
        notifications: [
          {
            userId: 'user1',
            companyId: 'company1',
            type: NotificationType.HAPPY_BIRTHDAY,
            channel: 'email',
            subject: 'Subject',
            content: 'Content',
          },
        ],
      };

      mockNotificationService.create.mockResolvedValue([fakeNotification]);

      const result = await controller.send(dto);

      expect(notificationService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResponse);
    });

    describe('negative cases', () => {
      it('should throw an error if notificationService.create throws an error', async () => {
        const dto: SendNotificationRequest = {
          userId: 'user1',
          companyId: 'company1',
          type: NotificationType.HAPPY_BIRTHDAY,
        };
        const error = new Error('Internal error');
        mockNotificationService.create.mockRejectedValueOnce(error);
        await expect(controller.send(dto)).rejects.toThrow('Internal error');
      });
    });
  });

  describe('findAll', () => {
    it('should call notificationService.findAll with provided userId and channel and return the result', async () => {
      const userId = 'user1';
      const channel = 'email';
      const notifications = [
        {
          id: 'notification1',
          userId,
          companyId: 'company1',
          type: NotificationType.HAPPY_BIRTHDAY,
          channel,
          subject: 'Subject',
          content: 'Content',
        },
      ];
      mockNotificationService.findAll.mockResolvedValue(notifications);

      const result = await controller.findAll(userId, channel);

      expect(notificationService.findAll).toHaveBeenCalledWith(userId, channel);
      expect(result).toEqual(notifications);
    });

    describe('negative cases', () => {
      it('should throw an error if notificationService.findAll throws an error', async () => {
        const userId = 'user1';
        const channel = 'email';
        const error = new Error('Internal error');
        mockNotificationService.findAll.mockRejectedValueOnce(error);
        await expect(controller.findAll(userId, channel)).rejects.toThrow(
          'Internal error',
        );
      });
    });
  });
});
