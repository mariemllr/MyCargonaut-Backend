import { Test, TestingModule } from '@nestjs/testing';
import { VehicleService } from '../vehicle/vehicle.service';
import { UserModule } from '../user/user.module';
import { createMock } from '@golevelup/ts-jest';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { VehicleType } from '../misc/constants';
import Vehicle from '../database/entities/vehicle.entity';
import User from '../database/entities/user.entity';
import Offer from '../database/entities/offer.entity';
import { Request } from '@nestjs/common';
import Review from '../database/entities/review.entity';
import { TypeOrmSQLITETestingModule } from '../../test/TypeORMSQLITETestingModule';
import { mock } from 'node:test';
import exp from 'node:constants';
import { Verify } from 'node:crypto';

describe('VehicleService', () => {
  let service: VehicleService;
  let userServiceMock: jest.Mocked<UserService>;
  let module: TestingModule;
  let testUser: User;

  beforeEach(async () => {
    module = await Test.createTestingModule({
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
    const mockUser = User.of(
      'testuser2@unittest.com',
      'Test123!',
      'Test',
      'Mustermann',
    );
    testUser = await mockUser;
    testUser.save();
    const vehicle = await Vehicle.of(
      1,
      'Test',
      VehicleType.LKW,
      'MAN',
      100,
      300,
      200,
      1000,
    );
    await vehicle.save();
    const vehicle2 = await Vehicle.of(
      1,
      'Test2',
      VehicleType.Anhaenger,
      'Hänger',
      110,
      30,
      220,
      415,
    );
    await vehicle2.save();
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
    await user.save();
    userServiceMock.findByEmail.mockReturnValue(
      Promise.resolve(user as unknown as User & { isOnline: boolean }),
    );
    const vehicle = await service.createVehicle(newVehicle);
    expect(vehicle).toBeDefined();
    expect(vehicle).toBeInstanceOf(Vehicle);
    expect(vehicle.name).toEqual('TestGefährt');
    expect(vehicle.type).toEqual(VehicleType.PKW);
    expect(vehicle.model).toEqual('VW Polo');
    expect(vehicle.mass_x).toEqual(10);
    expect(vehicle.mass_y).toEqual(11);
    expect(vehicle.mass_z).toEqual(12);
    expect(vehicle.weight).toEqual(100);
    expect(vehicle.id).toEqual(3);
    expect(vehicle.userId).toEqual(2);
  });

  afterAll(async () => {
    module.close();
  });

  it('should find right vehicle by email and name', async () => {
    userServiceMock.findByEmail.mockReturnValue(
      Promise.resolve(testUser as unknown as User & { isOnline: boolean }),
    );
    const vehicle = await service.findByEmailAndName(
      'testuser2@unittest.com',
      'Test',
    );
    expect(vehicle).toBeDefined();
    expect(vehicle).toBeInstanceOf(Vehicle);
    expect(vehicle.name).toEqual('Test');
    expect(vehicle.type).toEqual(VehicleType.LKW);
    expect(vehicle.model).toEqual('MAN');
    expect(vehicle.mass_x).toEqual(100);
    expect(vehicle.mass_y).toEqual(300);
    expect(vehicle.mass_z).toEqual(200);
    expect(vehicle.weight).toEqual(1000);
    expect(vehicle.id).toEqual(1);
    expect(vehicle.userId).toEqual(1);
  });

  it('should be able to get all vehicles by email', async () => {
    userServiceMock.findByEmail.mockReturnValue(
      Promise.resolve(testUser as unknown as User & { isOnline: boolean }),
    );
    const vehicle = await service.getVehicles('testuser2@unittest.com');
    expect(vehicle).toHaveLength(2);
    expect(vehicle[0]).toBeDefined();
    expect(vehicle[0]).toBeInstanceOf(Vehicle);
    expect(vehicle[0].name).toEqual('Test');
    expect(vehicle[0].type).toEqual(VehicleType.LKW);
    expect(vehicle[0].model).toEqual('MAN');
    expect(vehicle[0].mass_x).toEqual(100);
    expect(vehicle[0].mass_y).toEqual(300);
    expect(vehicle[0].mass_z).toEqual(200);
    expect(vehicle[0].weight).toEqual(1000);
    expect(vehicle[0].id).toEqual(1);
    expect(vehicle[0].userId).toEqual(1);
    expect(vehicle[1]).toBeDefined();
    expect(vehicle[1]).toBeInstanceOf(Vehicle);
    expect(vehicle[1].name).toEqual('Test2');
    expect(vehicle[1].type).toEqual(VehicleType.Anhaenger);
    expect(vehicle[1].model).toEqual('Hänger');
    expect(vehicle[1].mass_x).toEqual(110);
    expect(vehicle[1].mass_y).toEqual(30);
    expect(vehicle[1].mass_z).toEqual(220);
    expect(vehicle[1].weight).toEqual(415);
    expect(vehicle[1].id).toEqual(2);
    expect(vehicle[1].userId).toEqual(1);
  });

  it('should be able to update vehicle values', async () => {
    userServiceMock.findByEmail.mockReturnValue(
      Promise.resolve(testUser as unknown as User & { isOnline: boolean }),
    );
    const newVehicleValues = {
      name: 'Test3',
      model: 'Fahrradträger',
      type: VehicleType.Sonstiges,
      mass_x: 109,
      mass_y: 110,
      mass_z: 121,
      weight: 30,
    };
    const vehicle = await service.updateVehicle(
      'testuser2@unittest.com',
      'Test2',
      newVehicleValues,
    );
    expect(vehicle).toBeDefined();
    expect(vehicle).toBeInstanceOf(Vehicle);
    expect(vehicle.name).toEqual('Test3');
    expect(vehicle.type).toEqual(VehicleType.Sonstiges);
    expect(vehicle.model).toEqual('Fahrradträger');
    expect(vehicle.mass_x).toEqual(109);
    expect(vehicle.mass_y).toEqual(110);
    expect(vehicle.mass_z).toEqual(121);
    expect(vehicle.weight).toEqual(30);
    expect(vehicle.id).toEqual(2);
    expect(vehicle.userId).toEqual(1);
  });

  it('should be able to delete vehicle', async () => {});

  it('should not be able to find vehicle that does not exist', async () => {});
});
