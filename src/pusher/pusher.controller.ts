import { Body, Controller, Post } from '@nestjs/common';
import { PusherService } from './pusher.service';

@Controller('pusher')
export class PusherController {
  constructor(private pusherService: PusherService) {}

  @Post('message')
  async messages(
    @Body('username') username: string,
    @Body('message') message: string,
  ) {
    await this.pusherService.trigger('chat', 'message', {
      username,
      message,
    });

    return [];
  }
}
