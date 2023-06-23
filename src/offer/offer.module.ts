import { Module } from '@nestjs/common';
import { OfferController } from './offer.controller';

@Module({
  controllers: [OfferController]
})
export class OfferModule {}
