import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { createMock } from '@golevelup/ts-jest';
import { OfferService } from '../offer/offer.service';
import { RequestService } from '../request/request.service';
import { UserService } from '../user/user.service';
import { TypeOrmSQLITETestingModule } from '../../test/TypeORMSQLITETestingModule';
import Review from '../database/entities/review.entity';
import User from '../database/entities/user.entity';
import { Status } from '../misc/constants';
import Request from '../database/entities/request.entity';
import Offer from '../database/entities/offer.entity';

describe('ReviewService', () => {
  let service: ReviewService;
  let userServiceMock: UserService;
  let testUser: User;
  let offerServiceMock: OfferService;
  let offer: Offer;
  let testUser2: User;
  const token =
    'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3R1c2VyQHVuaXR0ZXN0LmNvbSIsImlhdCI6MTY5NDg1NDA3OCwiZXhwIjoxNjk0OTQwNDc4fQ.Mldspv9d3mCL1vlpjwejLF2O0c6RP1etgcWCViOZrHI; Path=/; Expires=Sun, 17 Sep 2023 08:47:58 GMT;';
  const token2 =
    'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3R1c2VyMkB1bml0dGVzdC5jb20iLCJpYXQiOjE2OTQ4NzgwMTIsImV4cCI6MTY5NDk2NDQxMn0.rwmVlNgjchih4j37gQQuu_a5G_W_A1zNb1PX2505Fuk; Path=/; Expires=Sun, 17 Sep 2023 15:26:52 GMT;';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmSQLITETestingModule()],
      providers: [
        ReviewService,
        { provide: UserService, useValue: createMock<UserService> },
        { provide: RequestService, useValue: createMock<RequestService> },
        { provide: OfferService, useValue: createMock<OfferService> },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
    userServiceMock = module.get<jest.Mocked<UserService>>(UserService);
    offerServiceMock = module.get<jest.Mocked<OfferService>>(OfferService);
    const mockUser = User.of(
      'testuser@unittest.com',
      'Test123!',
      'Test',
      'Mustermann',
    );
    testUser = await mockUser;
    await testUser.save();
    testUser2 = await User.of(
      'testuser2@unittest.com',
      'Test123!',
      'Max',
      'Mustermann',
    );
    await testUser2.save();
    offer = await Offer.of(
      1,
      2,
      'Berlin',
      'Giessen',
      new Date('2024-01-04'),
      50,
      0,
      0,
      1,
      '',
      100,
      0,
      0,
      0,
      true,
      false,
      Status.statusDone,
      '',
      null,
      null,
    );
    await offer.save();
    const review = await Review.of(3, 1, 2, null, 4, false, '', '', '');
    await review.save();
    const review2 = await Review.of(4, 1, 3, null, 4, true, '', '', '');
    await review2.save();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to create review for offer', async () => {
    offerServiceMock.getById = jest.fn(() => Promise.resolve(offer));
    userServiceMock.findByEmail = jest.fn(() =>
      Promise.resolve(testUser as unknown as User & { isOnline: boolean }),
    );
    let review = await service.createReview(token, {
      userId_reviewed: 2,
      offerId: 1,
      stars: 4,
      answer1: 'Antwort 1',
      answer2: 'Antwort 2',
      answer3: 'Antwort 3',
    });
    expect(review).toBeDefined();
    expect(review).toBeInstanceOf(Review);
    expect(review.userId_reviewed).toEqual(2);
    expect(review.offerId).toEqual(1);
    expect(review.stars).toEqual(4);
    expect(review.answer1).toEqual('Antwort 1');
    expect(review.answer2).toEqual('Antwort 2');
    expect(review.answer3).toEqual('Antwort 3');
    expect(review.visible).toEqual(false);
    expect(review.requestId).toBeNull();
    expect(review.id).toEqual(3);
    userServiceMock.findByEmail = jest.fn(() =>
      Promise.resolve(testUser2 as unknown as User & { isOnline: boolean }),
    );
    const review2 = await service.createReview(token2, {
      userId_reviewed: 1,
      offerId: 1,
      stars: 5,
      answer1: 'Antwort 1 von 2.',
      answer2: 'Antwort 2 von 2.',
      answer3: 'Antwort 3 von 2.',
    });
    expect(review2).toBeDefined();
    expect(review2).toBeInstanceOf(Review);
    expect(review2.userId_reviewed).toEqual(1);
    expect(review2.offerId).toEqual(1);
    expect(review2.stars).toEqual(5);
    expect(review2.answer1).toEqual('Antwort 1 von 2.');
    expect(review2.answer2).toEqual('Antwort 2 von 2.');
    expect(review2.answer3).toEqual('Antwort 3 von 2.');
    expect(review2.visible).toEqual(true);
    expect(review2.id).toEqual(4);
    review = await Review.findOne({ where: { id: 1 } });
    expect(review.visible).toBeTruthy;
  });

  it('should be able to get reviews by cookie', async () => {
    userServiceMock.findByEmail = jest.fn(() =>
      Promise.resolve(testUser as unknown as User & { isOnline: boolean }),
    );
    const reviews = await service.getReviewsByCookie(token);
    expect(reviews).toBeDefined();
    expect(reviews).toHaveLength(1);
    expect(reviews[0].userId_reviewed).toEqual(1);
    expect(reviews[0].offerId).toEqual(3);
    expect(reviews[0].stars).toEqual(4);
    expect(reviews[0].answer1).toEqual('');
    expect(reviews[0].answer2).toEqual('');
    expect(reviews[0].answer3).toEqual('');
    expect(reviews[0].visible).toEqual(true);
    expect(reviews[0].id).toEqual(2);
  });

  it('should be able to get only visible reviews by userid', async () => {
    userServiceMock.findByEmail = jest.fn(() =>
      Promise.resolve(testUser as unknown as User & { isOnline: boolean }),
    );
    const reviews = await service.getReviewsByUserId(1);
    expect(reviews).toBeDefined();
    expect(reviews).toHaveLength(1);
    expect(reviews[0].userId_reviewed).toEqual(1);
    expect(reviews[0].offerId).toEqual(3);
    expect(reviews[0].stars).toEqual(4);
    expect(reviews[0].answer1).toEqual('');
    expect(reviews[0].answer2).toEqual('');
    expect(reviews[0].answer3).toEqual('');
    expect(reviews[0].visible).toEqual(true);
    expect(reviews[0].id).toEqual(2);
  });
});
