import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from '../user/user.module';
import { createMock } from '@golevelup/ts-jest';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: createMock<UserService> },
        { provide: JwtService, useValue: createMock<JwtService> },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
