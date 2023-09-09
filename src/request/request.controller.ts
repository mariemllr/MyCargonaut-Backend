import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  Req,
  Res,
  UseGuards,
  Headers,
  HttpException,
  HttpStatus,
  Query,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { getEmailFromCookie } from '../misc/helper';
import Request from '../database/entities/request.entity';
import { Status } from '../misc/constants';
import { CreateRequestDto } from './dtos/CreateRequest.dto';
import { UpdateRequestDto } from './dtos/UpdateRequest.dto';
import { UpdateRequestStatusDto } from './dtos/UpdateRequestStatus';

@Controller('request')
export class RequestController {
  constructor(
    private readonly requestService: RequestService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createRequest(
    @Headers('cookie') cookie: string,
    @Body() createRequestData: CreateRequestDto,
  ) {
    const email = getEmailFromCookie(cookie);
    const user = await this.userService.findByEmail(email);
    if (user === undefined || user === null) {
      throw new HttpException(
        `user could not be found`,
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    const status = Status.statusPending;
    const request = await Request.of(
      user.id,
      null,
      createRequestData.startlocation,
      createRequestData.endlocation,
      createRequestData.date,
      createRequestData.seats,
      createRequestData.weight,
      createRequestData.mass_x,
      createRequestData.mass_y,
      createRequestData.mass_z,
      createRequestData.smoking,
      createRequestData.animals,
      status,
      createRequestData.notes,
    );
    await request.save();
    console.log(request);
    return request;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':requestId')
  async deleteRequest(
    @Param('requestId', ParseIntPipe) requestId: number,
    @Headers('cookie') cookie: string,
  ) {
    return this.requestService.deleteRequest(cookie, requestId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('myRequests')
  async getRequestsFromUser(@Headers('cookie') cookie: string) {
    return this.requestService.getRequestsFromUser(cookie);
  }

  @Get() // optional params for query?
  async getRequestsQ(@Query('sortBy') sortBy: string) {
    return this.requestService.getRequestsQ(sortBy);
  }

  @Get() // standard query
  async getRequests() {
    return this.requestService.getRequestsQ('asc');
  }

  @UseGuards(JwtAuthGuard)
  @Get(':requestId')
  async getById(@Param('requestId', ParseIntPipe) requestId: number) {
    return this.requestService.getById(requestId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':requestId')
  async updateRequest(
    @Param('requestId', ParseIntPipe) requestId: number,
    @Headers('cookie') cookie: string,
    @Body() updateRequestData: UpdateRequestDto,
  ) {
    return this.requestService.updateRequest(
      cookie,
      requestId,
      updateRequestData,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':requestId/accept')
  async acceptRequest(
    @Param('requestId', ParseIntPipe) requestId: number,
    @Headers('cookie') cookie: string,
  ) {
    return this.requestService.acceptRequest(cookie, requestId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':requestId/status')
  async updateRequestStatus(
    @Param('requestId', ParseIntPipe) requestId: number,
    @Headers('cookie') cookie: string,
    @Body() updateRequestStatus: UpdateRequestStatusDto,
  ) {
    return this.requestService.updateRequestStatus(
      cookie,
      requestId,
      updateRequestStatus,
    );
  }
}
