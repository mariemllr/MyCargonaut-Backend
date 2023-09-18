import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';
import { MsgType } from '../../misc/constants';

@Entity()
export default class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  recieverId: number;

  @Column({ nullable: true })
  text?: string;

  @Column()
  type: MsgType;

  @Column({ nullable: true })
  offerId?: number;

  static async of(
    userId: number,
    recieverId: number,
    text: string,
    type: MsgType,
    offerId: number,
  ) {
    const message = new Message();
    message.userId = userId;
    message.recieverId = recieverId;
    message.text = text;
    message.type = type;
    message.offerId = offerId;
    return message;
  }
}
