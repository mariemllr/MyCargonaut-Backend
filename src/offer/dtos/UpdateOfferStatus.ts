import { IsNotEmpty, IsEnum } from 'class-validator';
import { Status } from 'src/misc/constants';

export class UpdateOfferStatusDto {
  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;
}
