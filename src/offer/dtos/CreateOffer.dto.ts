import {
  IsNotEmpty,
  IsNumber,
  IsCurrency,
  IsString,
  IsDate,
  IsBoolean,
  IsInt,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOfferDto {
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

  @IsOptional()
  @IsNumber()
  price_absolute: number;

  @IsOptional()
  @IsNumber()
  price_per_freight: number;

  @IsOptional()
  @IsNumber()
  price_per_person: number;

  @IsNotEmpty()
  @IsInt()
  seats: number;

  @IsOptional()
  @IsString()
  stops: string;

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

  @IsOptional()
  @IsString()
  vehicle: string;

  @IsOptional()
  @IsString()
  trailer: string;
}
