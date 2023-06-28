import { Body, Controller, Get, Post, Req, Res, UseGuards, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { CreateOfferDto } from './dtos/CreateOffer.dto';
import { OfferService } from './offer.service';
import { UserService } from 'src/database/services/user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { getEmailFromCookie } from 'src/misc/helper';
import Offer from 'src/database/entities/offer.entity';
import { Status } from 'src/misc/constants';

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
            (await user).id,
            createOfferData.startlocation,
            createOfferData.endlocation,
            createOfferData.date,
            createOfferData.festpreis,
            createOfferData.price_freight,
            createOfferData.price_per_person,
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

    // Update

    // Edit status
}
