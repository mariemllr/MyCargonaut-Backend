import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [RequestController],
  providers: [RequestService, UserService]
})
export class RequestModule {}
