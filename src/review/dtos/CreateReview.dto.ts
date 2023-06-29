import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsInt,
  IsOptional
} from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsInt()
  userId_reviewer: number;

  @IsNotEmpty()
  @IsInt()
  userId_reviewed: number;

  @IsOptional()
  @IsInt()
  offerId: number;  

  @IsOptional()
  @IsInt()
  requestId: number;

  @IsNotEmpty()
  @IsInt()
  stars: number;

  @IsNotEmpty()
  @IsBoolean()
  visible: boolean;

  @IsNotEmpty()
  @IsString()
  answer1: string;

  @IsNotEmpty()
  @IsString()
  answer2: string;
  
  @IsNotEmpty()
  @IsString()
  answer3: string;
}