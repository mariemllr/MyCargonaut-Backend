import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from '../user/user.module';
import { createMock } from '@golevelup/ts-jest';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmSQLITETestingModule } from '../../test/TypeORMSQLITETestingModule';
import User from '../database/entities/user.entity';
import exp from 'constants';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let testUser: User;
  let userServiceMock: UserService;
  let jwtServiceMock: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmSQLITETestingModule()],
      providers: [
        AuthService,
        { provide: UserService, useValue: createMock<UserService> },
        { provide: JwtService, useValue: createMock<JwtService> },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userServiceMock = module.get<jest.Mocked<UserService>>(UserService);
    userServiceMock.authentication = jest.fn(
      (email: string, password: string) => Promise.resolve(true),
    );
    jwtServiceMock = module.get<jest.Mocked<JwtService>>(JwtService);
    jwtServiceMock.sign = jest.fn(() => 'testtoken123');
    const mockUser = User.of(
      'testuser@unittest.com',
      'Test123!',
      'Test',
      'Mustermann',
    );
    testUser = await mockUser;
    testUser.save();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to login registered user', async () => {
    const token = await service.login('testuser@unittest.com', 'Test123!');
    expect(token).toBeDefined();
    expect(token).toEqual('testtoken123');
  });

  it('should not be able to login unregistered user', async () => {
    userServiceMock.authentication = jest.fn(
      (email: string, password: string) => Promise.resolve(false),
    );
    try {
      await service.login('userNotExisting@unittest.com', 'Test123!');
      fail('should throw an exception');
    } catch (e) {
      expect(e).toBeInstanceOf(HttpException);
      expect(e.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
      expect(e.getResponse()).toEqual('user could not be authenticated');
    }
  });

  it('should be able to register user over 18', async () => {
    userServiceMock.authentication = jest.fn(
      (email: string, password: string) => Promise.resolve(true),
    );
    const token = await service.register(
      'newuser@unittest.com',
      'Test123!',
      'Erika',
      'Musterfrau',
      '01514443388',
      new Date('1988-03-23'),
    );
    expect(token).toBeDefined();
    expect(token).toEqual('testtoken123');
    const user = await User.findOne({
      where: { email: 'newuser@unittest.com' },
    });
    expect(user).toBeDefined();
    expect(user.email).toEqual('newuser@unittest.com');
    expect(user.firstName).toEqual('Erika');
  });

  it('should not be able to register user under 18', async () => {
    try {
      const token = await service.register(
        'newuser2@unittest.com',
        'Test123!',
        'ZuJung',
        'Musterfrau',
        '01514443388',
        new Date('2012-12-02'),
      );
      fail('should throw exception');
    } catch (e) {
      expect(e).toBeInstanceOf(HttpException);
      expect(e.getStatus()).toBe(HttpStatus.PRECONDITION_FAILED);
      expect(e.getResponse()).toEqual('user needs to be at least 18 years old');
      const user = await User.findOne({
        where: { email: 'newuser2@unittest.com' },
      });
      expect(user).toBeNull();
    }
  });
});
