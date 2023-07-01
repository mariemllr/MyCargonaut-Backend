import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export default class Review extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId_reviewer: number;

  @Column()
  userId_reviewed: number;

  @Column({ nullable: true })
  offerId: number;

  @Column({ nullable: true })
  requestId: number;

  @Column()
  stars: number;

  @Column({ default: true })
  visible: boolean;

  @Column()
  answer1: string;

  @Column()
  answer2: string;

  @Column()
  answer3: string;

  static async of(
    userId_reviewer: number,
    userId_reviewed: number,
    offerId: number,
    requestId: number,
    stars: number,
    visible: boolean,
    answer1: string,
    answer2: string,
    answer3: string,
  ) {
    const review = new Review();
    review.userId_reviewer = userId_reviewer;
    review.userId_reviewed = userId_reviewed;
    review.offerId = offerId;
    review.requestId = requestId;
    review.stars = stars;
    review.visible = visible;
    review.answer1 = answer1;
    review.answer2 = answer2;
    review.answer3 = answer3;

    return review;
  }
}
