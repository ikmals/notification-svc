import { Module } from '@nestjs/common';
import { NotificationModule } from './modules/notification/notification.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/notifications'),
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
