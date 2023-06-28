import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from 'src/misc/constants';
@Entity()
export default class Offer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  startlocation?: string;

  @Column()
  endlocation?: string;

  @Column()
  date?: Date;

  @Column({ default: true })
  festpreis?: boolean;

  @Column()
  price_freight?: number;

  @Column({ nullable: true })
  price_per_person?: number;

  @Column()
  seats?: number;

  @Column({ nullable: true })
  stops?: string;

  @Column({ nullable: true })
  weight?: number;

  @Column({ nullable: true })
  mass_x?: number;

  @Column({ nullable: true })
  mass_y?: number;

  @Column({ nullable: true })
  mass_z?: number;

  @Column({ nullable: true })
  smoking?: boolean;

  @Column({ nullable: true })
  animals?: boolean;

  @Column({ default: Status.statusPending})
  status?: Status;

  @Column({ nullable: true })
  notes?: string;

  static async of(
    userId: number,
    startlocation: string,
    endlocation: string,
    date: Date,
    festpreis: boolean,
    price_freight: number,
    price_per_person: number,
    seats: number,
    stops: string,
    weight: number,
    mass_x: number,
    mass_y: number,
    mass_z: number,
    smoking: boolean,
    animals: boolean,
    status: Status,
    notes: string,
  ) {
    const offer = new Offer();
    offer.userId = userId;
    offer.startlocation = startlocation;
    offer.endlocation = endlocation;
    offer.date = date;
    offer.festpreis = festpreis;
    offer.price_freight = price_freight;
    offer.price_per_person = price_per_person;
    offer.seats = seats;
    offer.stops = stops;
    offer.weight = weight;
    offer.mass_x = mass_x;
    offer.mass_y = mass_y;
    offer.mass_z = mass_z;
    offer.smoking = smoking;
    offer.animals = animals;
    offer.status = status;
    offer.notes = notes;

    return offer;
  }
}
