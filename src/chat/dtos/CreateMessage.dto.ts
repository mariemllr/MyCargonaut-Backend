import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateMessageDto {
  @IsInt()
  recieverId: number;

  @IsOptional()
  @IsString()
  text: string;

  @IsOptional()
  @IsInt()
  offerId: number;
}
