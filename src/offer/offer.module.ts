import { Module } from '@nestjs/common';
import { OfferController } from './offer.controller';
import {
  DatabaseModule,
  TypeORMDatabaseModule,
} from '../database/database.module';
import { OfferService } from './offer.service';
import { AuthModule } from '../auth/auth.module';
import { VehicleModule } from '../vehicle/vehicle.module';

@Module({
  imports: [DatabaseModule, TypeORMDatabaseModule, AuthModule, VehicleModule],
  controllers: [OfferController],
  providers: [OfferService],
  exports: [OfferService],
})
export class OfferModule {}
