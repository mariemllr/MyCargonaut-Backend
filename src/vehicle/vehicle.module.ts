import { VehicleService } from './vehicle.service';
import { Module, forwardRef } from '@nestjs/common';
import { VehicleController } from './vehicle.controller';
import {
  DatabaseModule,
  TypeORMDatabaseModule,
} from '../database/database.module';
import { OfferModule } from 'src/offer/offer.module';

@Module({
  imports: [DatabaseModule, TypeORMDatabaseModule],
  controllers: [VehicleController],
  providers: [VehicleService],
  exports: [VehicleService],
})
export class VehicleModule {}
