import { Test, TestingModule } from '@nestjs/testing';
import {
  NotificationRepository,

} from './notification.repository';
import { getModelToken } from '@nestjs/mongoose';
import { Notification } from './entities/notification.entity';
import { NotificationPredicate } from '../../common/interfaces/notification.interface';

describe('NotificationRepository', () => {
  let repository: NotificationRepository;
  let model: any;

  const fakeNotification = {
    userId: 'user1',
    companyId: 'company1',
    type: 'HAPPY_BIRTHDAY',
    channel: 'email',
    subject: 'Test Subject',
    content: 'Test Content',
  };

  beforeEach(async () => {
    model = {
      find: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([fakeNotification]),
      }),
    };

    const modelProvider = {
      provide: getModelToken(Notification.name),
      useValue: model,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationRepository, modelProvider],
    }).compile();

    repository = module.get<NotificationRepository>(NotificationRepository);
  });

  describe('create', () => {
    it('should create and save a notification', async () => {
      const newNotification = {
        userId: 'user1',
        companyId: 'company1',
        type: 'HAPPY_BIRTHDAY',
        channel: 'email',
        subject: 'Test Subject',
        content: 'Test Content',
      };

      const saveSpy = jest.fn().mockResolvedValue(newNotification);
      const ModelMock = jest.fn().mockImplementation((doc) => ({
        ...doc,
        save: saveSpy,
      }));

      Object.defineProperty(repository, 'notificationModel', {
        value: ModelMock,
        writable: true,
      });

      const result = await repository.create(
        newNotification.userId,
        newNotification.companyId,
        newNotification.type,
        newNotification.channel,
        newNotification.subject,
        newNotification.content,
      );

      expect(ModelMock).toHaveBeenCalledWith(newNotification);
      expect(saveSpy).toHaveBeenCalled();
      expect(result).toEqual(newNotification);
    });
  });

  describe('find', () => {
    it('should find notifications based on the predicate', async () => {
      const predicate: NotificationPredicate = {
        userId: 'user1',
        channel: 'email',
      };

      const expectedQuery = { userId: 'user1', channel: 'email' };

      const findSpy = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([fakeNotification]),
      });

      Object.defineProperty(repository, 'notificationModel', {
        value: { find: findSpy },
        writable: true,
      });

      const result = await repository.find(predicate);
      expect(findSpy).toHaveBeenCalledWith(expectedQuery);
      expect(result).toEqual([fakeNotification]);
    });
  });

  describe('convertPredicateToQuery', () => {
    it('should convert a complete predicate to a query filter', () => {
      const predicate: NotificationPredicate = {
        userId: 'user1',
        companyId: 'company1',
        type: 'HAPPY_BIRTHDAY',
        channel: 'email',
      };
      const query = repository.convertPredicateToQuery(predicate);
      expect(query).toEqual({
        userId: 'user1',
        companyId: 'company1',
        type: 'HAPPY_BIRTHDAY',
        channel: 'email',
      });
    });

    it('should return an empty object for an empty predicate', () => {
      const predicate: NotificationPredicate = {};
      const query = repository.convertPredicateToQuery(predicate);
      expect(query).toEqual({});
    });

    it('should only include defined properties in the query', () => {
      const predicate: NotificationPredicate = {
        userId: 'user1',
        type: 'MONTHLY_PAYSLIP',
      };
      const query = repository.convertPredicateToQuery(predicate);
      expect(query).toEqual({
        userId: 'user1',
        type: 'MONTHLY_PAYSLIP',
      });
    });
  });
});
