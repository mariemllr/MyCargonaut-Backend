import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import {
  DatabaseModule,
  TypeORMDatabaseModule,
} from '../database/database.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { VehicleModule } from '../vehicle/vehicle.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  controllers: [UserController],
  imports: [
    DatabaseModule,
    TypeORMDatabaseModule,
    forwardRef(() => AuthModule),
    forwardRef(() => VehicleModule),
    forwardRef(() => ChatModule),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
