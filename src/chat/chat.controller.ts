import { Controller, Post, Get, Headers, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dtos/CreateMessage.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('createMessage')
  async createMessage(
    @Headers('cookie') cookie: string,
    @Body() createMessageData: CreateMessageDto,
  ) {
    return this.chatService.createMessage(cookie, createMessageData);
  }

  @Get() // get all messages that are made for CURRENT
  async getChatFromCurrentUser(@Headers('cookie') cookie: string) {
    return this.chatService.getChatByCookie(cookie);
  }
}
