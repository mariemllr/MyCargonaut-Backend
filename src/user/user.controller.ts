import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { diskStorage } from 'multer';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserService } from 'src/database/services/user.service';
import {
  MAX_USER_IMAGE_FILE_SIZE,
  PASSWORD_OPTIONS,
  USER_IMAGE_LOCATION,
} from 'src/misc/constants';
import { getEmailFromCookie } from 'src/misc/helper';
import { Response } from 'express';
import { generate } from 'generate-passphrase';
import User from 'src/database/entities/user.entity';

class UpdateUserDTO {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsStrongPassword(PASSWORD_OPTIONS)
  password?: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;
}

class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;
}

@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  logger = new Logger('AuthController');
  /**
   * Request is sent to Guard. Token gets checked.
   * @param req Whole Request with Header
   * @returns name of User if Token is vaild or Access denied via Guard.
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUser(@Headers('cookie') cookie: string) {
    const email = getEmailFromCookie(cookie);
    const user = await this.userService.findByEmail(email);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Put('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({ destination: USER_IMAGE_LOCATION }),
    }),
  )
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image',
        })
        .addMaxSizeValidator({
          maxSize: MAX_USER_IMAGE_FILE_SIZE,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Headers('authorization') bearerToken: string,
    @Headers('cookie') cookie: string,
  ) {
    const token = await this.authService.getTokenString(cookie, bearerToken);
    return this.userService.updateImage(token, file.path);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('image')
  async deleteImage(@Headers('cookie') cookie: string) {
    const email = getEmailFromCookie(cookie);
    this.userService.deleteImage(email);
  }

  @UseGuards(JwtAuthGuard)
  @Put('')
  async updateSelf(
    @Headers('cookie') cookie: string,
    @Res({ passthrough: true }) res: Response,
    @Body() newValues: UpdateUserDTO,
  ) {
    const email = getEmailFromCookie(cookie);
    // regenerate token if email changed
    if (newValues.email && newValues.email !== email) {
      const newToken = await this.authService.generateToken(newValues.email);
      res.cookie('token', newToken, {
        // same expiration as token itself
        expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      });
      this.logger.debug('generated new token as email changed');
    }
    return this.userService.updateUser(email, newValues);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':email')
  async updateUser(
    @Param('email') email: string,
    @Body() newValues: UpdateUserDTO,
  ) {
    return this.userService.updateUser(email, newValues);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createUser(
    @Body()
    { email, firstName, lastName, phoneNumber }: CreateUserDTO,
  ) {
    const temporaryPassword = generate({ length: 3, numbers: false });
    const user = await User.of(
      firstName,
      lastName,
      email,
      phoneNumber,
      temporaryPassword,
    );
    await user.save();
    return { ...user.clearSensitiveInformation(), temporaryPassword };
  }

  @Get(':email')
  async all(
    @Param('email') emailOrId: string,
    @Headers('cookie') cookie: string,
  ) {
    if (isNaN(+emailOrId)) {
      if (emailOrId === 'all' && cookie) {
        return this.userService.getUsers();
      }
      return this.userService.findByEmail(emailOrId);
    }
    return this.userService.findById(parseInt(emailOrId));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':email')
  async delete(@Param('email') email: string) {
    return this.userService.deleteUser(email);
  }

  @Get('exists/:email')
  async emailExists(@Param('email') email: string) {
    const exists = (await this.userService.findByEmail(email)) !== undefined;
    return exists;
  }
}
