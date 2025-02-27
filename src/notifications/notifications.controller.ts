import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('notifications')
export class NotificationsController {
  @Post()
  send(@Req() request: Request): string {
    return `This action sends a new notification for ${request.get('userId')}`;
  }

  @Get(':userId/:channel')
  findAll(
    @Param('userId') userId: string,
    @Param('channel') channel: string,
  ): string {
    return `Fetching notifications for user ${userId} and channel ${channel}`;
  }
}
