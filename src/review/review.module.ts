import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { UserService } from 'src/user/user.service';
import { DatabaseModule, TypeORMDatabaseModule } from 'src/database/database.module';
import { OfferService } from 'src/offer/offer.service';
import { OfferModule } from 'src/offer/offer.module';
import { RequestModule } from 'src/request/request.module';

@Module({
  imports: [DatabaseModule, TypeORMDatabaseModule, OfferModule, RequestModule],
  controllers: [ReviewController],
  providers: [ReviewService, UserService],
})
export class ReviewModule {}
