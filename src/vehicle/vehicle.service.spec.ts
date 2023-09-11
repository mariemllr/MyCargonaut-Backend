import { Test, TestingModule } from '@nestjs/testing';
import { VehicleService } from '../vehicle/vehicle.service';
import { UserModule } from '../user/user.module';
import { createMock } from '@golevelup/ts-jest';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { VehicleType } from '../misc/constants';
import Vehicle from '../database/entities/vehicle.entity';
import User from '../database/entities/user.entity';
import { createConnection, Connection, getConnection } from 'typeorm';
import Offer from '../database/entities/offer.entity';
import { Request } from '@nestjs/common';
import Review from '../database/entities/review.entity';
import { TypeOrmSQLITETestingModule } from '../../test/TypeORMSQLITETestingModule';
import { mock } from 'node:test';

describe('VehicleService', () => {
  let service: VehicleService;
  let userServiceMock: jest.Mocked<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmSQLITETestingModule()],
      providers: [
        VehicleService,
        { provide: UserService, useValue: createMock<UserService> },
        { provide: JwtService, useValue: createMock<JwtService> },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
    userServiceMock = module.get<jest.Mocked<UserService>>(UserService);
    userServiceMock.findByEmail = jest.fn();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new vehicle', async () => {
    const newVehicle = {
      user_email: 'testuser@unittest.com',
      name: 'TestGefährt',
      model: 'VW Polo',
      type: VehicleType.PKW,
      mass_x: 10,
      mass_y: 11,
      mass_z: 12,
      weight: 100,
    };
    const mockUser = User.of(
      'testuser@unittest.com',
      'Test123!',
      'Max',
      'Mustermann',
    );
    const user = await mockUser;
    user.id = 1;
    userServiceMock.findByEmail.mockReturnValue(
      Promise.resolve(user as unknown as User & { isOnline: boolean }),
    );
    const vehicle = await service.createVehicle(newVehicle);
    expect(vehicle).toBeDefined();
    expect(vehicle).toBeInstanceOf(Vehicle);
    expect(vehicle).toEqual(
      Vehicle.of(1, 'TestGefährt', VehicleType.PKW, 'VW Polo', 10, 11, 12, 100),
    );
  });
});
