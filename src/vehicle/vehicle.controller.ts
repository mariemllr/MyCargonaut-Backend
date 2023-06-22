import { Controller } from '@nestjs/common';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { VehicleType } from 'src/misc/constants';
class UpdateVehicleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsEnum(VehicleType)
  type?: VehicleType;

  @IsOptional()
  @IsNumber()
  mass_x?: number;

  @IsOptional()
  @IsNumber()
  mass_y?: number;

  @IsOptional()
  @IsNumber()
  mass_z?: number;

  @IsOptional()
  @IsNumber()
  weigth?: number;
}

class CreateVehicleDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  model: string;

  @IsNotEmpty()
  @IsEnum(VehicleType)
  type: VehicleType;

  @IsNotEmpty()
  @IsNumber()
  mass_x: number;

  @IsNotEmpty()
  @IsNumber()
  mass_y: number;

  @IsNotEmpty()
  @IsNumber()
  mass_z: number;

  @IsNotEmpty()
  @IsNumber()
  weigth: number;
}
@Controller()
export class VehicleController {}
