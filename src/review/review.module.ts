import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { UserService } from '../user/user.service';
import {
  DatabaseModule,
  TypeORMDatabaseModule,
} from '../database/database.module';
import { OfferService } from '../offer/offer.service';
import { OfferModule } from '../offer/offer.module';
import { RequestModule } from '../request/request.module';

@Module({
  imports: [DatabaseModule, TypeORMDatabaseModule, OfferModule, RequestModule],
  controllers: [ReviewController],
  providers: [ReviewService, UserService],
})
export class ReviewModule {}
