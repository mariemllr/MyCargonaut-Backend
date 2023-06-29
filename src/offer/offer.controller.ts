import { Body, Controller, Get, Post, Put, Param, Req, Res, UseGuards, Headers, HttpException, HttpStatus, Query, ParseIntPipe, Delete } from '@nestjs/common';
import { CreateOfferDto } from './dtos/CreateOffer.dto';
import { OfferService } from './offer.service';
import { UserService } from 'src/database/services/user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { getEmailFromCookie } from 'src/misc/helper';
import Offer from 'src/database/entities/offer.entity';
import { Status } from 'src/misc/constants';
import { UpdateOfferDto } from './dtos/UpdateOffer.dto';
import { UpdateOfferStatusDto } from './dtos/UpdateOfferStatus';

@Controller('offer')
export class OfferController {
    constructor(
        private readonly offerService: OfferService,
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post('create')
    async createOffer(    
        @Headers('cookie') cookie: string,
        @Body() createOfferData: CreateOfferDto
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
        const offer = await Offer.of(
            user.id,
            createOfferData.startlocation,
            createOfferData.endlocation,
            createOfferData.date,
            createOfferData.festpreis,
            parseFloat(String(createOfferData.price_freight)),
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
        );
        await offer.save();
        console.log(offer);
        return offer;
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':offerId')
    async deleteOffer(
        @Param('offerId', ParseIntPipe) offerId: number,
        @Headers('cookie') cookie: string,) {
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
        return this.offerService.getOffersQ("asc");
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
        @Body() updateOfferData: UpdateOfferDto
        ) {
        return this.offerService.updateOffer(cookie, offerId, updateOfferData);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':offerId/status')
    async updateOfferStatus(
        @Param('offerId', ParseIntPipe) offerId: number,
        @Headers('cookie') cookie: string,
        @Body() updateOfferStatus: UpdateOfferStatusDto
        ) {
        return this.offerService.updateOfferStatus(cookie, offerId, updateOfferStatus);
    }
}
