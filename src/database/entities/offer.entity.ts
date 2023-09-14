import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from 'src/misc/constants';
@Entity()
export default class Offer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ nullable: true })
  userId_accepter?: number;

  @Column()
  startlocation?: string;

  @Column()
  endlocation?: string;

  @Column()
  date?: Date;

  @Column({ nullable: true, type: 'real' })
  price_absolute?: number;

  @Column({ nullable: true, type: 'real' })
  price_per_freight?: number;

  @Column({ nullable: true, type: 'real' })
  price_per_person?: number;

  @Column()
  seats?: number;

  @Column({ nullable: true })
  stops?: string;

  @Column({ nullable: true, type: 'real' })
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

  @Column({ default: Status.statusPending })
  status?: Status;

  @Column({ nullable: true })
  notes?: string;

  @Column({ nullable: true })
  vehicle?: number;

  @Column({ nullable: true })
  trailer?: number;

  static async of(
    userId: number,
    userId_accepter: number,
    startlocation: string,
    endlocation: string,
    date: Date,
    price_absolute: number,
    price_per_freight: number,
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
    vehicle: number,
    trailer: number,
  ) {
    const offer = new Offer();
    offer.userId = userId;
    offer.userId_accepter = userId_accepter;
    offer.startlocation = startlocation;
    offer.endlocation = endlocation;
    offer.date = date;
    offer.price_absolute = price_absolute;
    offer.price_per_freight = price_per_freight;
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
    offer.vehicle = vehicle;
    offer.trailer = trailer;
    return offer;
  }
}
