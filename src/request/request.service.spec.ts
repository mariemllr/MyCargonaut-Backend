import { Test, TestingModule } from '@nestjs/testing';
import { RequestService } from './request.service';
import { createMock } from '@golevelup/ts-jest';
import { UserService } from '../user/user.service';
import { TypeOrmSQLITETestingModule } from '../../test/TypeORMSQLITETestingModule';
import User from '../database/entities/user.entity';
import Request from '../database/entities/request.entity';
import { Status } from '../misc/constants';

describe('RequestService', () => {
  let service: RequestService;
  let userServiceMock: UserService;
  let testUser: User;
  const token =
    'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3R1c2VyQHVuaXR0ZXN0LmNvbSIsImlhdCI6MTY5NDg1NDA3OCwiZXhwIjoxNjk0OTQwNDc4fQ.Mldspv9d3mCL1vlpjwejLF2O0c6RP1etgcWCViOZrHI; Path=/; Expires=Sun, 17 Sep 2023 08:47:58 GMT;';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmSQLITETestingModule()],
      providers: [
        RequestService,
        { provide: UserService, useValue: createMock<UserService> },
      ],
    }).compile();

    service = module.get<RequestService>(RequestService);
    userServiceMock = module.get<jest.Mocked<UserService>>(UserService);
    const mockUser = User.of(
      'testuser@unittest.com',
      'Test123!',
      'Test',
      'Mustermann',
    );
    testUser = await mockUser;
    await testUser.save();
    const mockUser2 = await User.of(
      'testuser2@unittest.com',
      'Test123!',
      'Max',
      'Mustermann',
    );
    await mockUser2.save();
    const request1 = await Request.of(
      1,
      null,
      'Siegen',
      'Gießen',
      new Date('2023-12-23'),
      1,
      0,
      0,
      0,
      0,
      true,
      false,
      Status.statusPending,
      '',
    );
    await request1.save();
    const request2 = await Request.of(
      1,
      null,
      'Berlin',
      'Hamburg',
      new Date('2023-10-21'),
      3,
      100,
      30,
      30,
      30,
      true,
      true,
      Status.statusPending,
      '',
    );
    await request2.save();
    const request3 = await Request.of(
      2,
      null,
      'Siegen',
      'Hamburg',
      new Date('2024-02-23'),
      3,
      0,
      0,
      0,
      0,
      false,
      false,
      Status.statusPending,
      '',
    );
    await request3.save();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to delete request', async () => {
    userServiceMock.findByEmail = jest.fn(() =>
      Promise.resolve(testUser as unknown as User & { isOnline: boolean }),
    );
    const requestToDelete = await Request.of(
      1,
      null,
      'Dresden',
      'Hamburg',
      new Date('2024-01-23'),
      0,
      20,
      30,
      100,
      10,
      false,
      true,
      Status.statusPending,
      '',
    );
    await requestToDelete.save();
    const success = await service.deleteRequest(token, 4);
    expect(success).toBeTruthy();
    const request = await Request.findOne({ where: { id: 4 } });
    expect(request).toBeNull();
  });

  it('should be able to get request by id', async () => {
    const request = await service.getById(1);
    expect(request).toBeDefined();
    expect(request).toBeInstanceOf(Request);
    expect(request.id).toEqual(1);
    expect(request.userId).toEqual(1);
    expect(request.startlocation).toEqual('Siegen');
    expect(request.endlocation).toEqual('Gießen');
    expect(request.date).toEqual(new Date('2023-12-23'));
    expect(request.seats).toEqual(1);
    expect(request.smoking).toEqual(true);
  });

  it('should be able to get requests from user', async () => {
    userServiceMock.findByEmail = jest.fn(() =>
      Promise.resolve(testUser as unknown as User & { isOnline: boolean }),
    );
    const requests = await service.getRequestsFromUser(token);
    expect(requests).toBeDefined();
    expect(requests).toHaveLength(2);
    expect(requests[0].id).toEqual(1);
    expect(requests[0].userId).toEqual(1);
    expect(requests[0].startlocation).toEqual('Siegen');
    expect(requests[0].endlocation).toEqual('Gießen');
    expect(requests[0].date).toEqual(new Date('2023-12-23'));
    expect(requests[0].seats).toEqual(1);
    expect(requests[0].smoking).toEqual(true);
    expect(requests[1].id).toEqual(2);
    expect(requests[1].userId).toEqual(1);
    expect(requests[1].startlocation).toEqual('Berlin');
    expect(requests[1].endlocation).toEqual('Hamburg');
    expect(requests[1].date).toEqual(new Date('2023-10-21'));
    expect(requests[1].seats).toEqual(3);
    expect(requests[1].smoking).toEqual(true);
    expect(requests[1].weight).toEqual(100);
    expect(requests[1].mass_x).toEqual(30);
    expect(requests[1].mass_y).toEqual(30);
    expect(requests[1].mass_z).toEqual(30);
  });

  it('should be able to get all requests', async () => {
    const requests = await service.getRequestsQ('asc');
    expect(requests).toBeDefined();
    expect(requests).toHaveLength(3);
    expect(requests[0].id).toEqual(1);
    expect(requests[0].userId).toEqual(1);
    expect(requests[0].startlocation).toEqual('Siegen');
    expect(requests[0].endlocation).toEqual('Gießen');
    expect(requests[0].date).toEqual(new Date('2023-12-23'));
    expect(requests[0].seats).toEqual(1);
    expect(requests[0].smoking).toEqual(true);
    expect(requests[1].id).toEqual(2);
    expect(requests[1].userId).toEqual(1);
    expect(requests[1].startlocation).toEqual('Berlin');
    expect(requests[1].endlocation).toEqual('Hamburg');
    expect(requests[1].date).toEqual(new Date('2023-10-21'));
    expect(requests[1].seats).toEqual(3);
    expect(requests[1].smoking).toEqual(true);
    expect(requests[1].weight).toEqual(100);
    expect(requests[1].mass_x).toEqual(30);
    expect(requests[1].mass_y).toEqual(30);
    expect(requests[1].mass_z).toEqual(30);
    expect(requests[2].id).toEqual(3);
    expect(requests[2].userId).toEqual(2);
    expect(requests[2].startlocation).toEqual('Siegen');
    expect(requests[2].endlocation).toEqual('Hamburg');
    expect(requests[2].date).toEqual(new Date('2024-02-23'));
    expect(requests[2].seats).toEqual(3);
    expect(requests[2].smoking).toEqual(false);
    expect(requests[2].weight).toEqual(0);
    expect(requests[2].mass_x).toEqual(0);
    expect(requests[2].mass_y).toEqual(0);
    expect(requests[2].mass_z).toEqual(0);
  });

  it('should be able to update request', async () => {
    const newValues = {
      startlocation: 'Frankfurt',
      endlocation: 'Dresden',
      date: new Date('2025-01-01'),
      seats: 3,
      weight: 50,
      mass_x: 100,
      mass_y: 110,
      mass_z: 120,
      smoking: true,
      animals: true,
      notes: 'updated',
    };
    const request = await service.updateRequest(token, 1, newValues);
    expect(request).toBeDefined();
    expect(request).toBeInstanceOf(Request);
    expect(request.id).toEqual(1);
    expect(request.userId).toEqual(1);
    expect(request.startlocation).toEqual('Frankfurt');
    expect(request.endlocation).toEqual('Dresden');
    expect(request.date).toEqual(new Date('2025-01-01'));
    expect(request.seats).toEqual(3);
    expect(request.smoking).toEqual(true);
    expect(request.mass_x).toEqual(100);
    expect(request.mass_y).toEqual(110);
    expect(request.mass_z).toEqual(120);
    expect(request.weight).toEqual(50);
    expect(request.animals).toEqual(true);
    expect(request.notes).toEqual('updated');
  });

  it('should be able to accept request', async () => {
    userServiceMock.findByEmail = jest.fn(() =>
      Promise.resolve(testUser as unknown as User & { isOnline: boolean }),
    );
    const request = await service.acceptRequest(token, 3);
    expect(request).toBeDefined();
    expect(request).toBeInstanceOf(Request);
    expect(request.id).toEqual(3);
    expect(request.userId).toEqual(2);
    expect(request.userId_accepter).toEqual(1);
  });

  it('should be able to update request status', async () => {
    userServiceMock.findByEmail = jest.fn(() =>
      Promise.resolve(testUser as unknown as User & { isOnline: boolean }),
    );
    const request = await service.updateRequestStatus(token, 1, {
      status: Status.statusCollected,
    });
    expect(request).toBeDefined();
    expect(request).toBeInstanceOf(Request);
    expect(request.id).toEqual(1);
    expect(request.status).toEqual(Status.statusCollected);
  });
});
