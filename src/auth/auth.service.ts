import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../database/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import User from '../database/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private logger: Logger = new Logger('AuthService');

  /**
   * Generating new Access Token, Add new User with email and token
   * @param email of User
   * @returns generates Access Token
   */
  async login(email: string, password: string): Promise<string> {
    if (!(await this.userService.authentication(email, password)))
      throw new HttpException(
        'user could not be authenticated',
        HttpStatus.UNAUTHORIZED,
      );
    return this.generateToken(email);
  }

  async generateToken(email: string) {
    return this.jwtService.sign({ email });
  }

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string,
    birthday: Date,
  ) {
    const user = await User.of(
      email,
      password,
      firstName,
      lastName,
      phone,
      birthday,
    );
    await user.save();
    return this.login(email, password);
  }

  /**
   * Strips Token-Sting of "token=" and "Bearer= "
   * @param cookie
   * @param bearerToken
   * @returns plain token string or undefined
   */
  async getTokenString(
    cookie: string,
    bearerToken: any,
  ): Promise<string | undefined> {
    if (cookie) {
      // remove "token=" from start
      return cookie.replace(/^token=/, '');
    } else if (bearerToken) {
      // Remove Bearer and whitespace from start
      return bearerToken.replace(/^Bearer\s/, '');
    }
    return undefined;
  }
}
