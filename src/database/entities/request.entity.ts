import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from 'src/misc/constants';
@Entity()
export default class Request extends BaseEntity {
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

  @Column({ type: 'real' }) // @Frontend: input is needed as String
  price?: number;

  @Column()
  seats?: number;

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

  @Column({ default: Status.statusPending})
  status?: Status;

  @Column({ nullable: true })
  notes?: string;

  static async of(
    userId: number,
    startlocation: string,
    endlocation: string,
    date: Date,
    price: number,
    seats: number,
    weight: number,
    mass_x: number,
    mass_y: number,
    mass_z: number,
    smoking: boolean,
    animals: boolean,
    status: Status,
    notes: string,
  ) {
    const request = new Request();
    request.userId = userId;
    request.startlocation = startlocation;
    request.endlocation = endlocation;
    request.date = date;
    request.price = price;
    request.seats = seats;
    request.weight = weight;
    request.mass_x = mass_x;
    request.mass_y = mass_y;
    request.mass_z = mass_z;
    request.smoking = smoking;
    request.animals = animals;
    request.status = status;
    request.notes = notes;

    return request;
  }
}
