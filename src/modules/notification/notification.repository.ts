import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './entities/notification.entity';
import { NotificationPredicate } from '../../common/interfaces/notification.interface';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {}

  async create(
    userId: string,
    companyId: string,
    type: string,
    channel: string,
    subject?: string,
    content?: string,
  ): Promise<Notification> {
    const doc = new this.notificationModel({
      userId,
      companyId,
      type,
      channel,
      subject,
      content,
    });
    return doc.save();
  }

  async find(predicate: NotificationPredicate): Promise<Notification[]> {
    const query = this.convertPredicateToQuery(predicate);
    return this.notificationModel.find(query).exec();
  }

  convertPredicateToQuery(
    predicate: NotificationPredicate,
  ): Record<string, string> {
    const query: Record<string, string> = {};
    if (predicate.userId) {
      query.userId = predicate.userId;
    }
    if (predicate.companyId) {
      query.companyId = predicate.companyId;
    }
    if (predicate.type) {
      query.type = predicate.type;
    }
    if (predicate.channel) {
      query.channel = predicate.channel;
    }
    return query;
  }
}
