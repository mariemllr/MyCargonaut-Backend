import { Controller, Post, Get, Delete, ParseIntPipe, Param, Headers, Body } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dtos/CreateReview.dto';

@Controller('review')
export class ReviewController {
    constructor(
        private readonly reviewService: ReviewService
    ) {}

    /*  helper create review, gets called after payment is complete,
    *   This helper creates two reviews, one for each perspective
    *   The concern here is only to create a review once it has been filled out by frontend
    */

    @Post()
    async createReview(
        @Headers('cookie') cookie: string,
        @Body() createReviewData: CreateReviewDto
    ) {
        return this.reviewService.createReview(cookie, createReviewData)
    }

    // no edit visible needed, that is happening internally:
    //      as soon as a review is created, we check if the partner is done:
    //      if true both are visble, if false the new one is not visible

    @Get(':userId') // get all reviews that are made for not by this user
    async getReviewsFromUser(
        @Param('userId', ParseIntPipe) userId: number
    ) {
        return this.reviewService.getReviewsByUserId(userId);
    }

    @Get() // get all reviews that are made for CURRENT
    async getReviewsFromCurrentUser(
        @Headers('cookie') cookie: string
    ) {
        return this.reviewService.getReviewsByCookie(cookie);
    }
}

