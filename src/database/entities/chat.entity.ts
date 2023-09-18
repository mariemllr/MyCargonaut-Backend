import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Chat extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  recieverId: number;

  static async of(userId: number, recieverId: number) {
    const chat = new Chat();
    chat.userId = userId;
    chat.recieverId = recieverId;
    return chat;
  }
}
