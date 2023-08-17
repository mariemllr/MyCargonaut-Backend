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
import { OfferService } from './offer.service';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { getEmailFromCookie } from '../misc/helper';
import Offer from '../database/entities/offer.entity';
import { Status } from '../misc/constants';
import { CreateOfferDto } from './dtos/CreateOffer.dto';
import { UpdateOfferDto } from './dtos/UpdateOffer.dto';
import { UpdateOfferStatusDto } from './dtos/UpdateOfferStatus';
import { VehicleService } from '../vehicle/vehicle.service';

@Controller('offer')
export class OfferController {
  constructor(
    private readonly offerService: OfferService,
    private readonly userService: UserService,
    private readonly vehicleService: VehicleService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createOffer(
    @Headers('cookie') cookie: string,
    @Body() createOfferData: CreateOfferDto,
  ) {
    const email = getEmailFromCookie(cookie);
    const user = await this.userService.findByEmail(email);
    if (user === undefined || user === null) {
      throw new HttpException(
        `user could not be found`,
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    let vehicleId = null;
    if (
      createOfferData.vehicle !== undefined &&
      createOfferData.vehicle !== null
    ) {
      const vehicle = await this.vehicleService.findByEmailAndName(
        email,
        createOfferData.vehicle,
      );
      if (vehicle === undefined || vehicle === null) {
        throw new HttpException(
          `vehicle could not be found`,
          HttpStatus.PRECONDITION_FAILED,
        );
      }
      vehicleId = vehicle.id;
    }
    let trailerId = null;
    if (
      createOfferData.trailer !== undefined &&
      createOfferData.trailer !== null
    ) {
      const trailer = await this.vehicleService.findByEmailAndName(
        email,
        createOfferData.trailer,
      );
      if (trailer === undefined || trailer === null) {
        throw new HttpException(
          `trailer could not be found`,
          HttpStatus.PRECONDITION_FAILED,
        );
      }
      trailerId = trailer.id;
    }
    const status = Status.statusPending;
    const offer = await Offer.of(
      user.id,
      null,
      createOfferData.startlocation,
      createOfferData.endlocation,
      createOfferData.date,
      createOfferData.festpreis,
      parseFloat(String(createOfferData.price_absolute)),
      parseFloat(String(createOfferData.price_per_freight)),
      parseFloat(String(createOfferData.price_per_person)),
      createOfferData.seats,
      createOfferData.stops,
      createOfferData.weight,
      createOfferData.mass_x,
      createOfferData.mass_y,
      createOfferData.mass_z,
      createOfferData.smoking,
      createOfferData.animals,
      status,
      createOfferData.notes,
      vehicleId,
      trailerId,
    );
    await offer.save();
    console.log(offer);
    return offer;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':offerId')
  async deleteOffer(
    @Param('offerId', ParseIntPipe) offerId: number,
    @Headers('cookie') cookie: string,
  ) {
    return this.offerService.deleteOffer(cookie, offerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('myOffers')
  async getOffersFromUser(@Headers('cookie') cookie: string) {
    return this.offerService.getOffersFromUser(cookie);
  }

  @Get() // optional params for query?
  async getOffersQ(@Query('sortBy') sortBy: string) {
    return this.offerService.getOffersQ(sortBy);
  }

  @Get() // standard query
  async getOffers() {
    return this.offerService.getOffersQ('asc');
  }

  @UseGuards(JwtAuthGuard)
  @Get(':offerId')
  async getById(@Param('offerId', ParseIntPipe) offerId: number) {
    return this.offerService.getById(offerId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':offerId')
  async updateOffer(
    @Param('offerId', ParseIntPipe) offerId: number,
    @Headers('cookie') cookie: string,
    @Body() updateOfferData: UpdateOfferDto,
  ) {
    const email = getEmailFromCookie(cookie);
    const user = await this.userService.findByEmail(email);
    if (user === undefined || user === null) {
      throw new HttpException(
        `user could not be found`,
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    if (
      updateOfferData.vehicleName !== undefined &&
      updateOfferData.vehicleName !== null
    ) {
      const vehicle = await this.vehicleService.findByEmailAndName(
        email,
        updateOfferData.vehicleName,
      );
      if (vehicle === undefined || vehicle === null) {
        throw new HttpException(
          `vehicle could not be found`,
          HttpStatus.PRECONDITION_FAILED,
        );
      }
      updateOfferData.vehicle = vehicle.id;
    }
    if (
      updateOfferData.trailerName !== undefined &&
      updateOfferData.trailerName !== null
    ) {
      const trailer = await this.vehicleService.findByEmailAndName(
        email,
        updateOfferData.trailerName,
      );
      if (trailer === undefined || trailer === null) {
        throw new HttpException(
          `trailer could not be found`,
          HttpStatus.PRECONDITION_FAILED,
        );
      }
      updateOfferData.trailer = trailer.id;
    }
    return this.offerService.updateOffer(cookie, offerId, updateOfferData);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':offerId/accept')
  async acceptOffer(
    @Param('offerId', ParseIntPipe) offerId: number,
    @Headers('cookie') cookie: string,
  ) {
    return this.offerService.acceptOffer(cookie, offerId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':offerId/status')
  async updateOfferStatus(
    @Param('offerId', ParseIntPipe) offerId: number,
    @Headers('cookie') cookie: string,
    @Body() updateOfferStatus: UpdateOfferStatusDto,
  ) {
    return this.offerService.updateOfferStatus(
      cookie,
      offerId,
      updateOfferStatus,
    );
  }
}
