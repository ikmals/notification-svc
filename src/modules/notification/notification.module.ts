import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { UserModule } from '../user/user.module';
import { CompanyModule } from '../company/company.module';
import { ChannelModule } from '../channel/channel.module';
import { TemplateModule } from '../template/template.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notification,
  NotificationSchema,
} from './entities/notification.entity';
import { NotificationRepository } from './notification.repository';

@Module({
  imports: [
    UserModule,
    CompanyModule,
    ChannelModule,
    TemplateModule,
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository],
  exports: [NotificationService, NotificationRepository],
})
export class NotificationModule {}
