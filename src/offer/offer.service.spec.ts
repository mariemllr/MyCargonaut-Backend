import { Test, TestingModule } from '@nestjs/testing';
import { OfferService } from './offer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import User from '../database/entities/user.entity';
import { createMock, DeepMocked } from '@golevelup/ts-jest';

describe('OfferService', () => {
  let service: OfferService;
  let userService: DeepMocked<UserService>;
  const mockUserService = {
    updateImage: jest.fn(),
    deleteImage: jest.fn(),
    authentication: jest.fn(),
    deleteUser: jest.fn(),
    findOne: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    updateUser: jest.fn(),
    getUsers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OfferService,
        { provide: UserService, useValue: createMock<UserService> },
      ],
    }).compile();

    service = module.get<OfferService>(OfferService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
