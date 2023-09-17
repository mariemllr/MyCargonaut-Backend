import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import Request from '../database/entities/request.entity';
import { UserService } from '../user/user.service';
import { getEmailFromCookie } from '../misc/helper';
import { UpdateRequestStatusDto } from './dtos/UpdateRequestStatus';

@Injectable()
export class RequestService {
  constructor(private readonly userService: UserService) {}

  logger: Logger = new Logger('RequestService');

  private async checkAccess(cookie: string, requestId: number) {
    const user = await this.extractUser(cookie);
    const request = await this.getById(requestId);
    if (!request)
      throw new HttpException(
        `request requestId: '${requestId}' could not be found`,
        HttpStatus.PRECONDITION_FAILED,
      );

    if (user.id !== request.userId) {
      throw new HttpException(
        `user '${user.email}' does not own request '${requestId}'`,
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    console.log(`user: '${user.email}' has access to request: '${requestId}'`);
    return;
  }

  private async extractUser(cookie: string) {
    const email = getEmailFromCookie(cookie);
    const user = await this.userService.findByEmail(email);
    if (user === undefined || user === null)
      throw new HttpException(
        `user email: '${email}' could not be found`,
        HttpStatus.PRECONDITION_FAILED,
      );
    console.log(user.email);
    return user;
  }

  async deleteRequest(cookie: string, requestId: number) {
    await this.checkAccess(cookie, requestId);
    const request = await this.getById(requestId);
    await request.remove();
    return true;
  }

  async getById(id: number): Promise<Request | undefined> {
    try {
      const request = await Request.findOneByOrFail({ id });
      return request;
    } catch (error) {
      return undefined;
    }
  }

  async getRequestsFromUser(cookie: string): Promise<Request[]> {
    const user = await this.extractUser(cookie);
    try {
      const userId = user.id;
      return await Request.findBy({ userId });
    } catch (error) {
      return undefined;
    }
  }

  async getRequestsQ(sortBy: string): Promise<Request[]> {
    return await Request.find();
  }

  async updateRequest(
    cookie: string,
    requestId: number,
    newValue: {
      startlocation?: string;
      endlocation?: string;
      date?: Date;
      festpreis?: boolean;
      price_freight?: number;
      price_per_person?: number;
      seats?: number;
      stops?: string;
      weight?: number;
      mass_x?: number;
      mass_y?: number;
      mass_z?: number;
      smoking?: boolean;
      animals?: boolean;
      notes?: string;
    },
  ) {
    await this.checkAccess(cookie, requestId);
    const request = await this.getById(requestId);

    for (let [key, value] of Object.entries(newValue).filter(
      ([_, value]) => value !== undefined && value !== null,
    )) {
      request[key] = value;
    }

    return await request.save();
  }

  async acceptRequest(cookie: string, requestId: number) {
    const user = await this.extractUser(cookie);
    const request = await this.getById(requestId);
    request.userId_accepter = user.id;
    return await request.save();
  }

  async updateRequestStatus(
    cookie: string,
    requestId: number,
    updateRequestStatus: UpdateRequestStatusDto,
  ) {
    await this.checkAccess(cookie, requestId);
    const request = await this.getById(requestId);
    request.status = updateRequestStatus.status;
    return await request.save();
  }
}
