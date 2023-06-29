import {
    IsOptional,
    IsNumber,
    IsCurrency,
    IsString,
    IsDate,
    IsBoolean,
    IsInt,
    IsEmail
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
    price_freight: number;

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
}