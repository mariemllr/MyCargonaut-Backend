import { Test, TestingModule } from '@nestjs/testing';
import { VehicleService } from '../vehicle/vehicle.service';
import { UserModule } from '../user/user.module';
import { createMock } from '@golevelup/ts-jest';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

describe('VehicleService', () => {
  let service: VehicleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        { provide: UserService, useValue: createMock<UserService> },
        { provide: JwtService, useValue: createMock<JwtService> },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
