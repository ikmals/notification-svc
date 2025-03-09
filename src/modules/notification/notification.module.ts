import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { UserModule } from '../user/user.module';
import { CompanyModule } from '../company/company.module';
import { ChannelModule } from '../channel/channel.module';
import { TemplateModule } from '../template/template.module';

@Module({
  imports: [UserModule, CompanyModule, ChannelModule, TemplateModule],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
