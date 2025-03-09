import { Module } from '@nestjs/common';
import { EmailChannel } from './providers/email.channel';
import { UIChannel } from './providers/ui.channel';
import { ChannelService } from './channel.service';

@Module({
  providers: [EmailChannel, UIChannel, ChannelService],
  exports: [ChannelService],
})
export class ChannelModule {}
