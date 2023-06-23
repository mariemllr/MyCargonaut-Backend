import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { CreateOfferDto } from './dtos/CreateOffer.dto';

@Controller('offer')
export class OfferController {

    @Post('create')
    createOffer(@Body() offerData: CreateOfferDto) {
        console.log(offerData.seats);
        const data = offerData;
        return {data};
    }

    // Update

    // Edit status
}
