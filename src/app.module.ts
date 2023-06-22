import { VehicleModule } from './vehicle/vehicle.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import {
  DatabaseModule,
  TypeORMDatabaseModule,
} from './database/database.module';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    VehicleModule,
    AuthModule,
    DatabaseModule,
    UserModule,
    TypeORMDatabaseModule,
  ],
  exports: [AuthModule, DatabaseModule, UserModule],
})
export class AppModule {}
