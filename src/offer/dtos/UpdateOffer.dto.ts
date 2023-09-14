import {
  IsOptional,
  IsNumber,
  IsCurrency,
  IsString,
  IsDate,
  IsBoolean,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
export class UpdateOfferDto {
  @IsOptional()
  @IsString()
  startlocation: string;

  @IsOptional()
  @IsString()
  endlocation: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsOptional()
  @IsBoolean()
  festpreis: boolean;

  @IsOptional()
  @IsCurrency()
  price_absolute: number;

  @IsOptional()
  @IsCurrency()
  price_per_freight: number;

  @IsOptional()
  @IsCurrency()
  price_per_person: number;

  @IsOptional()
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
  vehicleName: string;

  @IsOptional()
  @IsString()
  trailerName: string;

  @IsOptional()
  @IsNumber()
  vehicle: number;

  @IsOptional()
  @IsNumber()
  trailer: number;
}
