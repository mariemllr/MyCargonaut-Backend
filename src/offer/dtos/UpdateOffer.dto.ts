import { Status } from 'src/misc/constants';
export class UpdateOfferDto {
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

    status?: Status;

    notes?: string;
}