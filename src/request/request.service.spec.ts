import { Test, TestingModule } from '@nestjs/testing';
import { RequestService } from './request.service';
import { createMock } from '@golevelup/ts-jest';
import { UserService } from '../user/user.service';

describe('RequestService', () => {
  let service: RequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestService,
        { provide: UserService, useValue: createMock<UserService> },
      ],
    }).compile();

    service = module.get<RequestService>(RequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
