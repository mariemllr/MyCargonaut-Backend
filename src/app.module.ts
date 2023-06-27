import { VehicleModule } from './vehicle/vehicle.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import {
  DatabaseModule,
  TypeORMDatabaseModule,
} from './database/database.module';
import { UserModule } from './user/user.module';
import { VehicleService } from './database/services/vehicle.service';
import { ProfileModule } from './profile/profile.module';
@Module({
  imports: [
    VehicleModule,
    AuthModule,
    DatabaseModule,
    UserModule,
    TypeORMDatabaseModule,
    ProfileModule,
  ],
  exports: [AuthModule, DatabaseModule, UserModule],
  providers: [VehicleService],
})
export class AppModule {}
