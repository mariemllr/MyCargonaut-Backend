import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import {
  DatabaseModule,
  TypeORMDatabaseModule,
} from 'src/database/database.module';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  imports: [
    DatabaseModule,
    TypeORMDatabaseModule,
    forwardRef(() => AuthModule),
  ],
})
export class UserModule {}
