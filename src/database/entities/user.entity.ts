import { HttpException, HttpStatus } from '@nestjs/common';
import { hashUserPassword } from '../../misc/helper';
import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName?: string;

  @Column()
  lastName?: string;

  @Column()
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ default: null })
  image?: string;

  @Column({ select: false })
  password?: string;

  @Column({ default: false })
  isLoggedIn: boolean;

  clearSensitiveInformation() {
    const user = { ...this };
    user.password = undefined;
    user.image = User.getStaticImageRoute(user.image);
    return user;
  }

  static getStaticImageRoute(image?: string): string {
    if (!image) return undefined;
    return image.replace('public', '').replace(/\\/g, '/');
  }

  static async of(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone?: string,
  ) {
    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.phone = phone;
    if (password) {
      user.password = await hashUserPassword(password);
    }
    if ((await User.findOne({ where: { email } })) !== null)
      throw new HttpException(
        `user with email '${user.email}' already exists`,
        HttpStatus.PRECONDITION_FAILED,
      );
    return user;
  }
}
