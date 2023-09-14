import {
  Body,
  Controller,
  Post,
  Res,
  UseGuards,
  Headers,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  IsNotEmpty,
  IsStrongPassword,
  IsString,
  IsMobilePhone,
  IsDate,
  IsOptional,
} from 'class-validator';
import { PASSWORD_OPTIONS } from '../misc/constants';
import { Type } from 'class-transformer';

class LoginDTO {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  password: string;
}

class RegisterDTO {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword(PASSWORD_OPTIONS)
  password: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsMobilePhone('de-DE')
  phone: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  birthday: Date;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  logger = new Logger('AuthController');

  /**
   * Route for Login and creating new User with an Access Token
   * @param email as JSON in Body of Post Request
   * @returns Access Token
   */
  @Post('login')
  async login(
    @Body() { email, password }: LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(email, password);
    res.cookie('token', token, {
      // same expiration as token itself
      expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    });
    this.logger.debug(
      `new login request from ${email} with new token: ${token}`,
    );
  }

  /**
   * Route for Login and creating new User with an Access Token
   * @param email as JSON in Body of Post Request
   * @returns Access Token
   */
  @Post('register')
  async register(
    @Body()
    { email, password, firstName, lastName, phone, birthday }: RegisterDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.register(
      email,
      password,
      firstName,
      lastName,
      phone,
      birthday,
    );
    res.cookie('token', token, {
      // same expiration as token itself
      expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    });
    this.logger.debug(`registered new user: ${email} with new token: ${token}`);
  }

  /**
   * Cookie and BearerToken will be checked for a valid Token
   * User with Token will be deleted in saved Users
   * Cookie Token is set to expired
   * @param bearerToken Access Token stored in authorization
   * @param cookie Access Token in Cookie
   * @returns true by Success, otherwise false
   */
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @Headers('authorization') bearerToken: string,
    @Headers('cookie') cookie: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.getTokenString(cookie, bearerToken);
    // set cookie to expire now
    res.cookie('token', token, {
      expires: new Date(new Date().getTime()),
    });
  }
}
