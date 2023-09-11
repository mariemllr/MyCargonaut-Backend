import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateReviewDto } from './dtos/CreateReview.dto';
import { UserService } from '../user/user.service';
import { getEmailFromCookie } from '../misc/helper';
import Review from '../database/entities/review.entity';
import User from '../database/entities/user.entity';
import { OfferService } from '../offer/offer.service';
import { RequestService } from '../request/request.service';
import { Status } from '../misc/constants';

@Injectable()
export class ReviewService {
  constructor(
    private readonly userService: UserService,
    private readonly offerService: OfferService,
    private readonly requestService: RequestService,
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

  async createReview(cookie: string, createReviewData: CreateReviewDto) {
    let done;
    let isOffer;
    if (
      createReviewData.offerId === undefined &&
      createReviewData.requestId === undefined
    ) {
      throw new HttpException(
        'offerId or requestId is required',
        HttpStatus.PRECONDITION_FAILED,
      );
    } else if (createReviewData.offerId === undefined) {
      const request = this.requestService.getById(createReviewData.requestId);
      done = (await request).status === Status.statusDone;
      isOffer = false;
    } else {
      const offer = this.offerService.getById(createReviewData.offerId);
      done = (await offer).status === Status.statusDone;
      isOffer = true;
    }
    if (!done) {
      throw new HttpException(
        'Status needs to be "Done" to create a review',
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    const user = await this.extractUser(cookie);
    let visible;
    let review;
    if (isOffer) {
      review = await Review.findOneBy({ offerId: createReviewData.offerId });
      visible = review !== undefined && review !== null;
    } else {
      review = await Review.findOneBy({
        requestId: createReviewData.requestId,
      });
      visible = review !== undefined && review !== null;
    }
    const newReview = await Review.of(
      user.id,
      createReviewData.userId_reviewed,
      createReviewData.offerId,
      createReviewData.requestId,
      createReviewData.stars,
      visible,
      createReviewData.answer1,
      createReviewData.answer2,
      createReviewData.answer3,
    );
    if (visible) {
      review['visible'] = true;
    }
    return newReview.save();
  }

  async getReviewsByCookie(cookie: string): Promise<Review[]> {
    return await this.getReviewsByUserId((await this.extractUser(cookie)).id);
  }

  async getReviewsByUserId(userId: number): Promise<Review[]> {
    const reviews = await Review.find({
      where: { userId_reviewed: userId, visible: true },
    });
    return reviews;
  }
}
