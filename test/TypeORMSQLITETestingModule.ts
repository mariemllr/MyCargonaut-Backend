import { TypeOrmModule } from '@nestjs/typeorm';
import Vehicle from '../src/database/entities/vehicle.entity';
import User from '../src/database/entities/user.entity';
import Review from '../src/database/entities/review.entity';
import Offer from '../src/database/entities/offer.entity';
import Request from '../src/database/entities/request.entity';

export const TypeOrmSQLITETestingModule = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [Vehicle, User, Review, Request, Offer],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([Vehicle]),
  TypeOrmModule.forFeature([User]),
  TypeOrmModule.forFeature([Review]),
  TypeOrmModule.forFeature([Request]),
  TypeOrmModule.forFeature([Offer]),
];
