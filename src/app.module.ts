import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import {
  DatabaseModule,
  TypeORMDatabaseModule,
} from './database/database.module';
import { UserModule } from './user/user.module';
import { OfferModule } from './offer/offer.module';
@Module({
  imports: [AuthModule, DatabaseModule, UserModule, TypeORMDatabaseModule, OfferModule],
  exports: [AuthModule, DatabaseModule, UserModule],
})
export class AppModule {}
