import { IsNotEmpty, IsEnum } from 'class-validator';
import { Status } from '../../misc/constants';

export class UpdateRequestStatusDto {
  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;
}
