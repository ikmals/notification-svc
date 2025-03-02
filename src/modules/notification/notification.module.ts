import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { CompanyModule } from '../company/company.module';
import { UserModule } from '../users/user.module';

@Module({
  imports: [UserModule, CompanyModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
