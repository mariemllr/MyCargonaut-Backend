import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import Vehicle from '../entities/vehicle.entity';
import { VehicleType } from '../../misc/constants';

@Injectable()
export class VehicleService {
  constructor(private readonly userService: UserService) {}
  logger: Logger = new Logger('VehicleService');

  /**
   * Delete Vehicle from Vehicle array
   * @param email to identify user
   * @param name to identify vehicle
   * @returns true if successful otherwise false
   */
  async deleteVehicle(email: string, name: string): Promise<boolean> {
    const user = await this.userService.findByEmail(email);
    if (user === undefined || user === null) return false;
    const vehicle = await this.findOne(user.id, name);
    if (vehicle === undefined || vehicle === null) return false;
    vehicle.remove();
    return true;
  }

  /**
   * Find Vehicle Object with given userId and name
   * @param userId to identify User
   * @param name to identify instance
   * @returns Vehicle Object or undefined if no Vehicle found
   */
  private async findOne(
    userId: number,
    name: string,
  ): Promise<Vehicle | undefined> {
    try {
      return Vehicle.findOne({
        where: { userId, name },
      });
    } catch (error) {
      return undefined;
    }
  }

  async findById(id: number): Promise<Vehicle | undefined> {
    try {
      const vehicle = await Vehicle.findOneOrFail({
        where: { id },
      });
      return vehicle;
    } catch (error) {
      return undefined;
    }
  }

  async findByEmailAndName(
    email: string,
    name: string,
  ): Promise<Vehicle | undefined> {
    try {
      const user = await this.userService.findByEmail(email);
      if (!user)
        throw new HttpException(
          `user '${email}' could not be found`,
          HttpStatus.PRECONDITION_FAILED,
        );
      const vehicle = await this.findOne(user.id, name);
      return vehicle;
    } catch (error) {
      return undefined;
    }
  }

  async updateVehicle(
    email: string,
    name: string,
    newValue: {
      name?: string;
      type?: VehicleType;
      model?: string;
      mass_x?: number;
      mass_y?: number;
      mass_z?: number;
      weight?: number;
    },
  ) {
    const user = await this.userService.findByEmail(email);
    if (!user)
      throw new HttpException(
        `user '${email}' could not be found`,
        HttpStatus.PRECONDITION_FAILED,
      );
    const vehicle = await this.findOne(user.id, name);
    if (!vehicle)
      throw new HttpException(
        `vehicle from user '${email}' with name '${name}' could not be found`,
        HttpStatus.PRECONDITION_FAILED,
      );
    for (let [key, value] of Object.entries(newValue).filter(
      ([_, value]) => value !== undefined && value !== null,
    )) {
      vehicle[key] = value;
    }
    return await vehicle.save();
  }

  async createVehicle(
    userId: number,
    name: string,
    type: VehicleType,
    model: string,
    mass_x: number,
    mass_y: number,
    mass_z: number,
    weight: number,
  ) {
    if ((await Vehicle.findOne({ where: { userId, name } })) !== null) {
      throw new HttpException(
        `vehicle with name '${name}' is already registered with user '${userId}'`,
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    const vehicle = await Vehicle.of(
      userId,
      name,
      type,
      model,
      mass_x,
      mass_y,
      mass_z,
      weight,
    );
    await vehicle.save();
    return vehicle;
  }

  /**
   * Return all current Vehicles from user
   * @param email email to identify user
   * @returns Array with all vehicles
   */
  async getVehicles(email: string): Promise<Vehicle[]> {
    const user = await this.userService.findByEmail(email);
    if (!user)
      throw new HttpException(
        `user '${email}' could not be found`,
        HttpStatus.PRECONDITION_FAILED,
      );
    const userId = user.id;
    return await Vehicle.find({ where: { userId } });
  }
}
