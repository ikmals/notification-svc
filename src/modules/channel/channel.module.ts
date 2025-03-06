import { Module } from '@nestjs/common';
import { EmailChannel } from './implementations/email.channel';
import { UIChannel } from './implementations/ui.channel';
import { ChannelService } from './channel.service';

@Module({
  providers: [EmailChannel, UIChannel, ChannelService],
  exports: [ChannelService],
})
export class ChannelModule {}
