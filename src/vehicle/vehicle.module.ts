import { VehicleService } from './../database/services/vehicle.service';
import { Module } from '@nestjs/common';
import { VehicleController } from './vehicle.controller';
import {
  DatabaseModule,
  TypeORMDatabaseModule,
} from 'src/database/database.module';

@Module({
  imports: [DatabaseModule, TypeORMDatabaseModule],
  controllers: [VehicleController],
  providers: [VehicleService],
})
export class VehicleModule {}
