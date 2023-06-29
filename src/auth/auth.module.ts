import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import {
  DatabaseModule,
  TypeORMDatabaseModule,
} from '../database/database.module';

const AuthPassportModule = PassportModule.register({ defaultStrategy: 'jwt' });
const AuthJwtModule = JwtModule.register({
  secret: jwtConstants.secret,
  signOptions: { expiresIn: '86400s' }, // One Day = 86400s
});

@Module({
  imports: [
    AuthPassportModule,
    AuthJwtModule,
    DatabaseModule,
    TypeORMDatabaseModule,
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, AuthPassportModule],
  controllers: [AuthController],
})
export class AuthModule {}
