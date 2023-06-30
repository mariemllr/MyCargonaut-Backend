import { HttpException, HttpStatus } from '@nestjs/common';
import { VehicleType } from '../../misc/constants';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  static async of(
    userId: number,
    name: string,
    type: VehicleType,
    model: string,
    mass_x: number,
    mass_y: number,
    mass_z: number,
    weight: number,
  ) {
    const vehicle = new Vehicle();
    vehicle.userId = userId;
    vehicle.name = name;
    vehicle.type = type;
    vehicle.model = model;
    vehicle.mass_x = mass_x;
    vehicle.mass_y = mass_y;
    vehicle.mass_z = mass_z;
    vehicle.weight = weight;
    return vehicle;
  }
}
