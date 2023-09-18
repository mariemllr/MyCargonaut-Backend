import { Module } from '@nestjs/common';
import {
  DatabaseModule,
  TypeORMDatabaseModule,
} from '../database/database.module';

import { OfferModule } from '../offer/offer.module';
import { UserService } from '../user/user.service';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

@Module({
  imports: [DatabaseModule, TypeORMDatabaseModule, OfferModule],
  controllers: [ChatController],
  providers: [UserService, ChatService],
})
export class ChatModule {}
