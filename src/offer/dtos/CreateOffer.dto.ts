import {
  IsNotEmpty,
  IsNumber,
  IsCurrency,
  IsString,
  IsDate,
  IsBoolean,
  IsInt,
  IsEmail
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOfferDto {
    @IsNotEmpty()
    @IsEmail()
    userEmail: string;

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

    @IsBoolean()
    festpreis: boolean;

    @IsNotEmpty()
    @IsCurrency()
    price_freight: number;

    @IsCurrency()
    price_per_person: number;

    @IsNotEmpty()
    @IsInt()
    seats: number;

    @IsString()
    stops: string;

    @IsNumber()
    weight: number;

    @IsInt()
    mass_x: number;

    @IsInt()
    mass_y: number;

    @IsInt()
    mass_z: number;

    @IsBoolean()
    smoking: boolean;

    @IsBoolean()
    animals: boolean;

    @IsString()
    notes: string;
}