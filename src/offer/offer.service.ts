import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import Offer from 'src/database/entities/offer.entity';
import { UserService } from 'src/user/user.service';
import { getEmailFromCookie } from 'src/misc/helper';
import { UpdateOfferStatusDto } from './dtos/UpdateOfferStatus';

@Injectable()
export class OfferService {
  constructor(private readonly userService: UserService) {}

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
      vehicleName?: string;
      trailerName?: string;
      vehicle?: number;
      trailer?: number;
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

  async acceptOffer(cookie: string, offerId: number) {
    const user = await this.extractUser(cookie);
    const offer = await this.getById(offerId);
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
}
