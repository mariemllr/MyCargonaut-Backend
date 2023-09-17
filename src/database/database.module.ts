import { Module } from '@nestjs/common';
import { TypeOrmModule as DefaultTypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import User from './entities/user.entity';
import { UserService } from '../user/user.service';

export const TypeORMDatabaseModule = DefaultTypeOrmModule.forRoot({
  type: 'postgres',
  host: 'cargonaut-db-1.cvti62mnyeqb.eu-north-1.rds.amazonaws.com',
  port: 5432, // Docker Container Port
  username: 'postgres',
  password: 'cargomaus69',
  database: 'cargonautpostgresdb',
  entities: [join(__dirname, 'entities', '*.entity{.ts,.js}')],
  synchronize: true,
  ssl: { rejectUnauthorized: false },
});

@Module({
  imports: [TypeORMDatabaseModule],
  providers: [UserService, User],
  exports: [TypeORMDatabaseModule, User, UserService],
})
export class DatabaseModule {}
