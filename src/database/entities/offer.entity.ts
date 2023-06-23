import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from 'src/misc/constants';
@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startlocation?: string;

  @Column()
  endlocation?: string;

  @Column()
  date?: Date;

  @Column()
  festpreis?: boolean;

  @Column()
  price_freight?: number;

  @Column()
  price_per_person?: number;

  @Column()
  seats?: number;

  @Column()
  stops?: string;

  @Column()
  weight?: number;

  @Column()
  mass_x?: number;

  @Column()
  mass_y?: number;

  @Column()
  mass_z?: number;

  @Column()
  smoking?: boolean;

  @Column()
  animals?: boolean;

  @Column({ default: Status.statusPending})
  status?: Status;

  @Column()
  notes?: string;

}
