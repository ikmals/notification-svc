import { Module } from '@nestjs/common';
import { NotificationModule } from './modules/notification/notification.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI as string),
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
