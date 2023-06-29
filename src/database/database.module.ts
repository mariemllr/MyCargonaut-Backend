import { Module } from '@nestjs/common';
import { TypeOrmModule as DefaultTypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import User from './entities/user.entity';
import { UserService } from '../user/user.service';
import { OfferModule } from 'src/offer/offer.module';
import Offer from './entities/offer.entity';
import { OfferService } from '../offer/offer.service';
import { VehicleModule } from '../vehicle/vehicle.module';
import Vehicle from './entities/vehicle.entity';
import { VehicleService } from './services/vehicle.service';

export const TypeORMDatabaseModule = DefaultTypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432, // Docker Container Port
  username: 'postgres',
  password: 'cargomaus69',
  database: 'postgres',
  entities: [join(__dirname, 'entities', '*.entity{.ts,.js}')],
  synchronize: true,
});

@Module({
  imports: [TypeORMDatabaseModule],
  providers: [UserService, User],
  exports: [TypeORMDatabaseModule, User, UserService],
})
export class DatabaseModule {}
