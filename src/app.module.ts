import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationsController } from './notifications/notifications.controller';

@Module({
  imports: [],
  controllers: [AppController, NotificationsController],
  providers: [AppService],
})
export class AppModule {}
