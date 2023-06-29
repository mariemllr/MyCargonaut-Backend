import { VehicleService } from './vehicle.service';
import { Module } from '@nestjs/common';
import { VehicleController } from './vehicle.controller';
import {
  DatabaseModule,
  TypeORMDatabaseModule,
} from '../database/database.module';

@Module({
  imports: [DatabaseModule, TypeORMDatabaseModule],
  controllers: [VehicleController],
  providers: [VehicleService],
  exports: [VehicleService],
})
export class VehicleModule {}
