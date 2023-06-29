import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { UserService } from 'src/user/user.service';

@Module({
    controllers: [ReviewController],
    providers: [ReviewService, UserService]
})
export class ReviewModule {}
