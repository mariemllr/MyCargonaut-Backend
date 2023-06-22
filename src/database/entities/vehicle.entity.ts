import { VehicleType } from 'src/misc/constants';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Vehicle extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  name?: string;

  @Column()
  type?: VehicleType;

  @Column()
  model?: string;

  @Column()
  mass_x?: number;

  @Column()
  mass_y?: number;

  @Column()
  mass_z?: number;

  @Column()
  weight?: number;
}
