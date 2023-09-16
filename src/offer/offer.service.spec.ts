import { Test, TestingModule } from '@nestjs/testing';
import { OfferService } from './offer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import User from '../database/entities/user.entity';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { TypeOrmSQLITETestingModule } from '../../test/TypeORMSQLITETestingModule';
import { generateToken } from '../misc/helper';
import Offer from '../database/entities/offer.entity';
import { Status } from '../misc/constants';
import { of } from 'rxjs';
import e from 'express';
import exp from 'constants';

describe('OfferService', () => {
  let service: OfferService;
  let userServiceMock: UserService;
  let testUser: User;
  const token =
    'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3R1c2VyQHVuaXR0ZXN0LmNvbSIsImlhdCI6MTY5NDg1NDA3OCwiZXhwIjoxNjk0OTQwNDc4fQ.Mldspv9d3mCL1vlpjwejLF2O0c6RP1etgcWCViOZrHI; Path=/; Expires=Sun, 17 Sep 2023 08:47:58 GMT;';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmSQLITETestingModule()],
      providers: [
        OfferService,
        { provide: UserService, useValue: createMock<UserService> },
      ],
    }).compile();

    service = module.get<OfferService>(OfferService);
    userServiceMock = module.get<jest.Mocked<UserService>>(UserService);
    const mockUser = User.of(
      'testuser@unittest.com',
      'Test123!',
      'Test',
      'Mustermann',
    );
    testUser = await mockUser;
    testUser.save();
    const mockUser2 = await User.of(
      'testuser2@unittest.com',
      'Test123!',
      'Max',
      'Mustermann',
    );
    mockUser2.save();
    const offer = await Offer.of(
      1,
      null,
      'Berlin',
      'Giessen',
      new Date('2024-01-04'),
      50,
      0,
      0,
      1,
      '',
      100,
      0,
      0,
      0,
      true,
      false,
      Status.statusPending,
      '',
      null,
      null,
    );
    await offer.save();
    const offer2 = await Offer.of(
      1,
      null,
      'Siegen',
      'Köln',
      new Date('2024-04-23'),
      0,
      100,
      20,
      1,
      '',
      10,
      30,
      0,
      0,
      true,
      false,
      Status.statusPending,
      'Test',
      null,
      null,
    );
    await offer2.save();
    const offer3 = await Offer.of(
      2,
      null,
      'Siegen',
      'Hamburg',
      new Date('2023-12-04'),
      530,
      0,
      0,
      3,
      '',
      40,
      0,
      30,
      0,
      false,
      true,
      Status.statusPending,
      'Hallo',
      null,
      null,
    );
    await offer3.save();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to delete offer', async () => {
    userServiceMock.findByEmail = jest.fn(() =>
      Promise.resolve(testUser as unknown as User & { isOnline: boolean }),
    );
    const offerToDelete = await Offer.of(
      1,
      null,
      'Siegen',
      'Giessen',
      new Date('2024-01-01'),
      50,
      0,
      0,
      1,
      '',
      0,
      0,
      0,
      0,
      false,
      false,
      Status.statusPending,
      '',
      null,
      null,
    );
    await offerToDelete.save();
    const success = await service.deleteOffer(token, 2);
    expect(success).toBeTruthy();
    const offer = await Offer.findOne({ where: { id: 2 } });
    expect(offer).toBeNull();
  });

  it('should be able to get offer by id if it exists', async () => {
    const offer = await service.getById(1);
    expect(offer).toBeDefined();
    expect(offer).toBeInstanceOf(Offer);
    expect(offer.id).toEqual(1);
    expect(offer.userId).toEqual(1);
    expect(offer.startlocation).toEqual('Berlin');
    expect(offer.endlocation).toEqual('Giessen');
    expect(offer.date).toEqual(new Date('2024-01-04'));
    expect(offer.price_absolute).toEqual(50);
  });

  it('should be able to get all offers from user', async () => {
    userServiceMock.findByEmail = jest.fn(() =>
      Promise.resolve(testUser as unknown as User & { isOnline: boolean }),
    );
    const offers = await service.getOffersFromUser(token);
    expect(offers).toBeDefined();
    expect(offers).toHaveLength(2);
    expect(offers[0].id).toEqual(1);
    expect(offers[0].userId).toEqual(1);
    expect(offers[0].startlocation).toEqual('Berlin');
    expect(offers[0].endlocation).toEqual('Giessen');
    expect(offers[0].date).toEqual(new Date('2024-01-04'));
    expect(offers[0].price_absolute).toEqual(50);
    expect(offers[1].id).toEqual(2);
    expect(offers[1].userId).toEqual(1);
    expect(offers[1].startlocation).toEqual('Siegen');
    expect(offers[1].endlocation).toEqual('Köln');
    expect(offers[1].date).toEqual(new Date('2024-04-23'));
    expect(offers[1].price_absolute).toEqual(0);
    expect(offers[1].price_per_freight).toEqual(100);
    expect(offers[1].price_per_person).toEqual(20);
  });

  it('should be able to get all offers (sorted)', async () => {
    const offers = await service.getOffersQ('asc');
    expect(offers).toBeDefined();
    expect(offers).toHaveLength(3);
    expect(offers[0].id).toEqual(1);
    expect(offers[0].userId).toEqual(1);
    expect(offers[0].startlocation).toEqual('Berlin');
    expect(offers[0].endlocation).toEqual('Giessen');
    expect(offers[0].date).toEqual(new Date('2024-01-04'));
    expect(offers[0].price_absolute).toEqual(50);
    expect(offers[1].id).toEqual(2);
    expect(offers[1].userId).toEqual(1);
    expect(offers[1].startlocation).toEqual('Siegen');
    expect(offers[1].endlocation).toEqual('Köln');
    expect(offers[1].date).toEqual(new Date('2024-04-23'));
    expect(offers[1].price_absolute).toEqual(0);
    expect(offers[1].price_per_freight).toEqual(100);
    expect(offers[1].price_per_person).toEqual(20);
    expect(offers[2].id).toEqual(3);
    expect(offers[2].userId).toEqual(2);
    expect(offers[2].startlocation).toEqual('Siegen');
    expect(offers[2].endlocation).toEqual('Hamburg');
    expect(offers[2].date).toEqual(new Date('2023-12-04'));
    expect(offers[2].price_absolute).toEqual(530);
    expect(offers[2].seats).toEqual(3);
  });

  it('should be able to update offer', async () => {
    const newValues = {
      startlocation: 'Frankfurt',
      endlocation: 'Dresden',
      date: new Date('2025-01-01'),
      festpreis: false,
      price_absolute: 0,
      price_per_freight: 100,
      price_per_person: 45,
      seats: 3,
      stops: 'Stuttgart',
      weight: 50,
      mass_x: 100,
      mass_y: 110,
      mass_z: 120,
      smoking: true,
      animals: true,
      notes: 'updated',
    };
    const offer = await service.updateOffer(token, 1, newValues);
    expect(offer).toBeDefined();
    expect(offer).toBeInstanceOf(Offer);
    expect(offer.id).toEqual(1);
    expect(offer.userId).toEqual(1);
    expect(offer.startlocation).toEqual('Frankfurt');
    expect(offer.endlocation).toEqual('Dresden');
    expect(offer.date).toEqual(new Date('2025-01-01'));
    expect(offer.price_absolute).toEqual(0);
    expect(offer.price_per_freight).toEqual(100);
    expect(offer.price_per_person).toEqual(45);
    expect(offer.seats).toEqual(3);
    expect(offer.stops).toEqual('Stuttgart');
    expect(offer.weight).toEqual(50);
    expect(offer.mass_x).toEqual(100);
    expect(offer.mass_y).toEqual(110);
    expect(offer.mass_z).toEqual(120);
    expect(offer.smoking).toEqual(true);
    expect(offer.animals).toEqual(true);
    expect(offer.notes).toEqual('updated');
  });

  it('should be able to accept offer', async () => {
    userServiceMock.findByEmail = jest.fn(() =>
      Promise.resolve(testUser as unknown as User & { isOnline: boolean }),
    );
    const offer = await service.acceptOffer(token, 3);
    expect(offer).toBeDefined();
    expect(offer).toBeInstanceOf(Offer);
    expect(offer.id).toEqual(3);
    expect(offer.userId).toEqual(2);
    expect(offer.userId_accepter).toEqual(1);
  });

  it('should be able to update offer status', async () => {
    userServiceMock.findByEmail = jest.fn(() =>
      Promise.resolve(testUser as unknown as User & { isOnline: boolean }),
    );
    const offer = await service.updateOfferStatus(token, 2, {
      status: Status.statusEnRoute,
    });
    expect(offer).toBeDefined();
    expect(offer).toBeInstanceOf(Offer);
    expect(offer.id).toEqual(2);
    expect(offer.status).toEqual(Status.statusEnRoute);
  });
});
