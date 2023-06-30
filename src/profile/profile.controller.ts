import {
  Body,
  Controller,
  Get,
  Headers,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { getEmailFromCookie } from 'src/misc/helper';
import { UserService } from 'src/user/user.service';
import { IsString, IsOptional, IsDate, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { Response } from 'express';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  birthday?: Date;

  @IsBoolean()
  @IsOptional()
  smoker?: boolean;

  @IsString()
  @IsOptional()
  note?: string;

  @IsString()
  @IsOptional()
  image?: string;
}

@Controller('profile')
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Headers('cookie') cookie: string) {
    const email = getEmailFromCookie(cookie);
    const user = await this.userService.findByEmail(email, undefined, [
      'firstName',
      'lastName',
      'birthday',
      'smoker',
      'note',
      'image',
    ]);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Put('')
  async updateSelf(
    @Headers('cookie') cookie: string,
    @Res({ passthrough: true }) res: Response,
    @Body() newValues: UpdateProfileDto,
  ) {
    const email = getEmailFromCookie(cookie);
    return this.userService.updateUser(email, newValues);
  }
}
