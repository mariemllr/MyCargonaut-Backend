import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { createMock } from '@golevelup/ts-jest';
import { OfferService } from '../offer/offer.service';
import { RequestService } from '../request/request.service';
import { UserService } from '../user/user.service';

describe('ReviewService', () => {
  let service: ReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        { provide: UserService, useValue: createMock<UserService> },
        { provide: RequestService, useValue: createMock<RequestService> },
        { provide: OfferService, useValue: createMock<OfferService> },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
