import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import User from '../database/entities/user.entity';
import { generateToken } from '../misc/helper';
import { TypeOrmSQLITETestingModule } from '../../test/TypeORMSQLITETestingModule';
import exp from 'constants';

describe('UserService', () => {
  let userService: UserService;
  let testUser: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmSQLITETestingModule()],
      providers: [UserService],
    }).compile();
    userService = module.get<UserService>(UserService);
    const mockUser = User.of(
      'testuser@unittest.com',
      'Test123!',
      'Test',
      'Mustermann',
    );
    testUser = await mockUser;
    await testUser.save();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should be able to authenticate user', async () => {
    const success = await userService.authentication(
      'testuser@unittest.com',
      'Test123!',
    );
    expect(success).toBeTruthy();
  });

  it('should not be able to authenticate user that does not exist', async () => {
    const success = await userService.authentication(
      'testuser2@unittest.com',
      'Test123!1',
    );
    expect(success).toBeFalsy();
  });

  it('should be able to delete user', async () => {
    const mockUser = User.of(
      'userToDelete@unittest.com',
      'Test123!',
      'Test',
      'Mustermann',
    );
    testUser = await mockUser;
    await testUser.save();
    const success = await userService.deleteUser('userToDelete@unittest.com');
    expect(success).toBeTruthy();
  });

  it('should be able to find user by email', async () => {
    const userObj = await userService.findByEmail('testuser@unittest.com');
    expect(userObj).toBeDefined();
    expect(userObj.email).toEqual('testuser@unittest.com');
    expect(userObj.firstName).toEqual('Test');
    expect(userObj.lastName).toEqual('Mustermann');
    expect(userObj.password).toBeUndefined();
  });

  it('should be able to find user by id', async () => {
    const userObj = await userService.findById(1);
    expect(userObj).toBeDefined();
    expect(userObj.email).toEqual('testuser@unittest.com');
    expect(userObj.firstName).toEqual('Test');
    expect(userObj.lastName).toEqual('Mustermann');
    expect(userObj.password).toBeUndefined();
  });

  it('should be able to update user', async () => {
    const user = User.of('user@unittest.com', 'Test123!', 'Edit', 'User');
    const userSaved = await user;
    await userSaved.save();
    const newValues = {
      firstName: 'New',
      email: 'newEmail@unittest.com',
      phone: '01512427777',
      birthday: new Date('01.01.2000'),
      note: 'Bearbeitet',
      smoker: false,
    };
    const editedUser = await userService.updateUser(
      'user@unittest.com',
      newValues,
    );
    expect(editedUser).toBeDefined();
    expect(editedUser.email).toEqual('newEmail@unittest.com');
    expect(editedUser.firstName).toEqual('New');
    expect(editedUser.lastName).toEqual('User');
    expect(editedUser.password).toBeUndefined();
    expect(editedUser.birthday).toEqual(new Date('01.01.2000'));
    expect(editedUser.note).toEqual('Bearbeitet');
    expect(editedUser.smoker).toBeFalsy();
    expect(editedUser.phone).toEqual('01512427777');
  });

  it('should be able to get all users', async () => {
    const secondUser = User.of(
      'secondUser@unittest.com',
      'Test123!',
      'Second',
      'User',
    );
    const secondUserSaved = await secondUser;
    await secondUserSaved.save();
    const users = await userService.getUsers();
    expect(users).toBeDefined();
    expect(users).toHaveLength(2);
    expect(users[0].email).toEqual('testuser@unittest.com');
    expect(users[0].firstName).toEqual('Test');
    expect(users[0].lastName).toEqual('Mustermann');
    expect(users[0].password).toBeUndefined();
    expect(users[1]).toBeDefined();
    expect(users[1].email).toEqual('secondUser@unittest.com');
    expect(users[1].firstName).toEqual('Second');
    expect(users[1].lastName).toEqual('User');
    expect(users[1].password).toBeUndefined();
  });
});
