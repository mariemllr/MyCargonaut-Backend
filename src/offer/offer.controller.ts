import { Body, Controller, Get, Post, Req, Res, UseGuards, Headers } from '@nestjs/common';
import { CreateOfferDto } from './dtos/CreateOffer.dto';
import { OfferService } from './offer.service';
import { UserService } from 'src/database/services/user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { getEmailFromCookie } from 'src/misc/helper';

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
        
        console.log(createOfferData.seats);
        const data = createOfferData;
        return {data};
    }

    // Update

    // Edit status
}
