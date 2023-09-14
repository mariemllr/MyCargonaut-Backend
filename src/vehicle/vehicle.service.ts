import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import Vehicle from '../database/entities/vehicle.entity';
import { VehicleType } from '../misc/constants';

@Injectable()
export class VehicleService {
  constructor(private readonly userService: UserService) {}
  logger: Logger = new Logger('VehicleService');

  /**
   * creates a new vehicle
   * @param newVehicle data of new vehicle object
   * @returns vehicle
   */
  async createVehicle(newVehicle: {
    user_email: string;
    name: string;
    type: VehicleType;
    model: string;
    mass_x: number;
    mass_y: number;
    mass_z: number;
    weight: number;
  }): Promise<Vehicle> {
    const user = this.userService.findByEmail(newVehicle.user_email);
    if (user === undefined || user === null) {
      throw new HttpException(
        `user '${newVehicle.user_email}' could not be found`,
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    const vehicle = await Vehicle.of(
      (
        await user
      ).id,
      newVehicle.name,
      newVehicle.type,
      newVehicle.model,
      newVehicle.mass_x,
      newVehicle.mass_y,
      newVehicle.mass_z,
      newVehicle.weight,
    );
    await vehicle.save();
    return vehicle;
  }

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
    await vehicle.remove();
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
    for (const [key, value] of Object.entries(newValue).filter(
      ([_, value]) => value !== undefined && value !== null,
    )) {
      vehicle[key] = value;
    }
    return await vehicle.save();
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
