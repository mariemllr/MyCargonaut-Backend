import { Test, TestingModule } from '@nestjs/testing';
import { VehicleService } from '../database/services/vehicle.service';
import { UserModule } from '../user/user.module';
import { VehicleController } from './vehicle.controller';
import User from '../database/entities/user.entity';
import { VehicleType } from '../misc/constants';
import Vehicle from '../database/entities/vehicle.entity';

describe('VehicleService', () => {
  let vehicleService: VehicleService;
  let user: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleController],
      imports: [UserModule,
      TypeOrmModule.forRoot({
        type: 'postgres',
          url: 'postgres://postgres:@db:5432/test', // read this from env
          autoLoadEntities: true,
          synchronize: true,
          dropSchema: true,
      })],
      providers: [VehicleService],
    }).compile();

    vehicleService = module.get<VehicleService>(VehicleService);
  });

  it('should be defined', () => {
    expect(vehicleService).toBeDefined();
  });

  beforeAll(async () => {
    user = await User.of(
      'test@abc.de',
      'test123!',
      'Max',
      'Mustermann',
      '01703631177',
      new Date(2000, 1, 1),
    );
  });

  it('should create vehicle', async () => {
    const newVehicle = await vehicleService.createVehicle(
      user.id,
      'TestVehicle',
      VehicleType.PKW,
      'VW Polo',
      10,
      10,
      10,
      10,
    );
    expect(newVehicle).toBeInstanceOf(Vehicle);
    expect(newVehicle.name).toBe('TestVehicle');
    expect(newVehicle.type).toBe(VehicleType.PKW);
    expect(newVehicle.model).toBe('VW Polo');
    expect(newVehicle.mass_x).toBe(10);
    expect(newVehicle.mass_y).toBe(10);
    expect(newVehicle.mass_z).toBe(10);
    expect(newVehicle.weight).toBe(10);
  });

  it('should not create vehicle where name is equal to already created vehicle (for same user)', async () => {
    expect(
      vehicleService.createVehicle(
        user.id,
        'TestVehicle',
        VehicleType.LKW,
        'VW Passat',
        100,
        100,
        100,
        100,
      ),
    ).rejects.toMatch(
      `vehicle with name 'VW Passat' is already registered with user '${user.id}'`,
    );
  });
});
