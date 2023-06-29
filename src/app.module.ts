import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import {
  DatabaseModule,
  TypeORMDatabaseModule,
} from './database/database.module';
import { UserModule } from './user/user.module';
import { OfferModule } from './offer/offer.module';
import { OfferService } from './offer/offer.service';
@Module({
  imports: [OfferModule, AuthModule, DatabaseModule, UserModule, TypeORMDatabaseModule],
  exports: [AuthModule, DatabaseModule, UserModule],
  providers: [OfferService]
})
export class AppModule {}
