import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import Offer from 'src/database/entities/offer.entity';
import { UserService } from 'src/user/user.service';
import { getEmailFromCookie } from 'src/misc/helper';
import { UpdateOfferStatusDto } from './dtos/UpdateOfferStatus';
import { HttpService } from "@nestjs/axios";
import { catchError, firstValueFrom, lastValueFrom, map, throwError } from "rxjs";
import { AxiosResponse } from "axios";

@Injectable()
export class OfferService {
  constructor(private readonly userService: UserService, private readonly httpService: HttpService) {}

  logger: Logger = new Logger('OfferService');

  private async checkAccess(cookie: string, offerId: number) {
    const user = await this.extractUser(cookie);
    const offer = await this.getById(offerId);
    if (!offer)
      throw new HttpException(
        `offer offerId: '${offerId}' could not be found`,
        HttpStatus.PRECONDITION_FAILED,
      );

    if (user.id !== offer.userId) {
      throw new HttpException(
        `user '${user.email}' does not own offer '${offerId}'`,
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    console.log(`user: '${user.email}' has access to offer: '${offerId}'`);
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

  async deleteOffer(cookie: string, offerId: number) {
    await this.checkAccess(cookie, offerId);
    const offer = await this.getById(offerId);
    offer.remove();
    return true;
  }

  async getById(id: number): Promise<Offer | undefined> {
    try {
      const offer = await Offer.findOneByOrFail({ id });
      return offer;
    } catch (error) {
      return undefined;
    }
  }

  async getOffersFromUser(cookie: string): Promise<Offer[]> {
    const user = await this.extractUser(cookie);
    try {
      const userId = user.id;
      return await Offer.findBy({ userId });
    } catch (error) {
      return undefined;
    }
  }

  async getOffersQ(sortBy: string): Promise<Offer[]> {
    return await Offer.find();
  }

  async updateOffer(
    cookie: string,
    offerId: number,
    newValue: {
      startlocation?: string;
      endlocation?: string;
      date?: Date;
      festpreis?: boolean;
      price_absolute?: number;
      price_per_freight?: number;
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
    await this.checkAccess(cookie, offerId);
    const offer = await this.getById(offerId);

    for (let [key, value] of Object.entries(newValue).filter(
      ([_, value]) => value !== undefined && value !== null,
    )) {
      offer[key] = value;
    }

    return await offer.save();
  }

  async acceptOffer(
    cookie: string, 
    offerId: number, 
    ) {
    const user = await this.extractUser(cookie);
    const offer = await this.getById(offerId);
    const accessToken = await this.generateAccessToken()
    const response = await this.createOrder(accessToken['access_token']);
    console.log(response);
    const id = response['id'];
    //await this.capturePayment(id, accessToken['access_token']);
    offer.userId_accepter = user.id;
    return await offer.save();
  }

  async updateOfferStatus(
    cookie: string,
    offerId: number,
    updateOfferStatus: UpdateOfferStatusDto,
  ) {
    await this.checkAccess(cookie, offerId);
    const offer = await this.getById(offerId);
    offer.status = updateOfferStatus.status;
    return await offer.save();
  }

  async generateAccessToken(): Promise<string> {
    const CLIENT_ID = 'Afd9v7pG-ip7BGWfNIIZiIhxccqwFwpHd-XUH4hKpSp6d4kOK-Faw96uFsQDZsbEEfjApHGGp7LLm2Rg';
    const APP_SECRET = 'EFlgXnB0e4j4CS4uBTdTqtQj6cbCsS0lBh8bQpxvDbD_d8oBzOKW0GGJlDa-tNNjIHzTorL93ekleBQJ';
    const auth = Buffer.from(CLIENT_ID + ':' + APP_SECRET).toString('base64');
    try {
    const response = await this.httpService
      .post(`https://api-m.sandbox.paypal.com/v1/oauth2/token`, 'grant_type=client_credentials', {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.error('Failed to generate Access Token:', error.message);
        return throwError('Failed to generate Access Token');
      }),
    )

    return firstValueFrom(response)
  } catch (error) {
    console.error('Failed to generate Access Token:', error.message);
    throw new Error('Failed to generate Access Token');
  }
  }

  async createOrder(accessToken: string): Promise<AxiosResponse<any>>{
    const url = `https://api-m.sandbox.paypal.com/v2/checkout/orders`;
    const payload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: '100.00',
          },
        },
      ],
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      return await firstValueFrom(
        this.httpService.post(url, payload, { headers }).pipe(
          map((response) => response.data),
          catchError((error) => {
            console.error('Failed to create order:', error.message);
            return throwError('Failed to create order');
          }),
        )
      );
    } catch (error) {
      console.error('Failed to create order:', error.message);
      throw new Error('Failed to create order');
    }
  }

  async capturePayment(orderID: string, accessToken: string): Promise<AxiosResponse<any>> {
    const url = `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      return await firstValueFrom(
        this.httpService.post(url, null, { headers }).pipe(
          map((response) => response.data),
          catchError((error) => {
            console.error('Failed to capture order:', error.message);
            return throwError('Failed to capture order');
          }),
        )
      );
    } catch (error) {
      console.error('Failed to capture order:', error.message);
      throw new Error('Failed to capture order');
    }
  }
}
