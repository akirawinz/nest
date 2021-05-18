import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostEntity } from '../../post/entities/post.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity({ name: 'comment' })
export class CommentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  userId: number;

  @Column()
  postId: number;

  @ManyToOne(() => PostEntity, () => (post: PostEntity) => post.comment, {
    eager: false,
    onDelete: 'CASCADE',
  })
  post: PostEntity[];

  @ManyToOne(() => UserEntity, () => (user: UserEntity) => user.comment, {
    eager: false,
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}
