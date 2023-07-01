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

  @IsNotEmpty()
  @IsBoolean()
  festpreis: boolean;

  @IsNotEmpty()
  @IsCurrency()
  price_freight: string; // @Frontend: input is needed as String

  @IsOptional()
  @IsCurrency()
  price_per_person: string; // @Frontend: input is needed as String

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
}
