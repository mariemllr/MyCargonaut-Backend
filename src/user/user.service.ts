/* eslint-disable prefer-const */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import User from '../database/entities/user.entity';
import { compare } from 'bcrypt';
import { getEmailFromToken, hashUserPassword } from 'src/misc/helper';
import { promises } from 'fs';
import { FindOneOptions } from 'typeorm';

const { rm, stat } = promises;

@Injectable()
export class UserService {
  logger: Logger = new Logger('UserService');

  async updateImage(userToken: string, newImage: string) {
    const email = getEmailFromToken(userToken);
    const user = await this.findOne(email);
    if (user.image) {
      try {
        await rm(user.image);
      } catch (error) {
        this.logger.error(`couldn't delete old userImage of ${email}`);
        this.logger.error(error);
      }
    }
    // throws error if file does not exist
    await stat(newImage);
    user.image = newImage;
    await user.save();
    return User.getStaticImageRoute(newImage);
  }

  async deleteImage(email: string) {
    const user = await this.findOne(email);
    if (!user.image) return;
    user.image = null;
    await user.save();
  }

  async authentication(email: string, password: string) {
    const user = await User.findOne({
      where: { email },
      select: { password: true },
    });
    if (!user) return false;
    const { password: hash } = user;
    return compare(password, hash);
  }

  /**
   * Delete User from Users-Array
   * @param token to identify User
   * @returns true if successful otherwise false
   */
  async deleteUser(email: string): Promise<boolean> {
    const user = await this.findOne(email);
    if (user === undefined || user === null) return false;
    user.remove();
    return true;
  }

  /**
   * Find User Object of given Access Token
   * @param token for Access
   * @returns User Object or undefined if no User with the Token is found
   */
  private async findOne(email: string): Promise<User | undefined> {
    try {
      return User.findOne({
        where: { email },
      });
    } catch (error) {
      return undefined;
    }
  }

  /**
   * same as findOne, but sanatizes password. Also resolves image
   * @param email email to look for
   * @returns User without password
   */
  async findByEmail(
    email: string,
    options?: FindOneOptions<User>,
    selectFields: (keyof User)[] = [],
  ): Promise<(User & { isOnline: boolean }) | undefined> {
    try {
      if (options) options.where = { email, ...options?.where };
      const user = await User.findOneOrFail(
        options ?? {
          where: { email },
        },
      );
      let clearedUser: User = user.clearSensitiveInformation();
      if (selectFields.length > 0) {
        clearedUser = selectFields.reduce(
          (obj, key) => ({ ...obj, [key]: user[key] }),
          {},
        ) as User;
      }

      return clearedUser as User & { isOnline: boolean };
    } catch (error) {
      return undefined;
    }
  }

  async findById(id: number): Promise<User | undefined> {
    try {
      const user = await User.findOneOrFail({
        where: { id },
      });
      return user.clearSensitiveInformation();
    } catch (error) {
      return undefined;
    }
  }

  async updateUser(
    email: string,
    newValue: {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
      phone?: string;
      birthday?: Date;
      note?: string;
      smoker?: boolean;
      image?: string;
    },
  ) {
    const user = await this.findOne(email);
    if (!user)
      throw new HttpException(
        `user '${email}' could not be found`,
        HttpStatus.PRECONDITION_FAILED,
      );
    for (let [key, value] of Object.entries(newValue).filter(
      ([_, value]) => value !== undefined && value !== null,
    )) {
      if (key === 'password') {
        value = await hashUserPassword(value as string);
      }
      user[key] = value;
    }
    return (await user.save()).clearSensitiveInformation();
  }

  /**
   * Return all current Users
   * @returns Array with all current Users
   */
  async getUsers(): Promise<User[]> {
    return (await User.find()).map((user) => user.clearSensitiveInformation());
  }
}
