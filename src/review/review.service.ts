import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateReviewDto } from './dtos/CreateReview.dto';
import { UserService } from 'src/user/user.service';
import { getEmailFromCookie } from 'src/misc/helper';
import Review from 'src/database/entities/review.entity';

@Injectable()
export class ReviewService {
    constructor(
        private readonly userService: UserService
    ) {}

    logger: Logger = new Logger('ReviewService');

    private async extractUser(cookie: string) {
        const email = getEmailFromCookie(cookie);
        const user = await this.userService.findByEmail(email);
        if (user === undefined || user === null)
            throw new HttpException(
                `user email: '${email}' could not be found`,
                HttpStatus.PRECONDITION_FAILED,
            );
        console.log(user.email);
        return user;
    }

    createReview(cookie: string, createReviewData: CreateReviewDto) {
        throw new Error('Method not implemented.');
    }

    async getReviewsByCookie(cookie: string): Promise<Review[]> {
        return await this.getReviewsByUserId((await this.extractUser(cookie)).id)
    }

    async getReviewsByUserId(userId: number): Promise<Review[]> {
        throw new Error('Method not implemented.');
    }
}
