import {
  IsNotEmpty,
  IsNumber,
  IsCurrency,
  IsString,
  IsDate,
  IsBoolean,
  IsInt,
  IsOptional
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRequestDto {
  @IsNotEmpty()
  @IsString()
  startlocation: string;

  @IsNotEmpty()
  @IsString()
  endlocation: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsNotEmpty()
  @IsCurrency()
  price: number; // @Frontend: input is needed as String

  @IsNotEmpty()
  @IsInt()
  seats: number;

  @IsOptional()
  @IsNumber()
  weight: number;

  @IsOptional()
  @IsInt()
  mass_x: number;

  @IsOptional()
  @IsInt()
  mass_y: number;

  @IsOptional()
  @IsInt()
  mass_z: number;

  @IsOptional()
  @IsBoolean()
  smoking: boolean;

  @IsOptional()
  @IsBoolean()
  animals: boolean;

  @IsOptional()
  @IsString()
  notes: string;
}