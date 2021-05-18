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
import { User } from '../../user/entities/user.entity';

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
  @ManyToOne(() => User, () => (user: User) => user.comment, {
    eager: false,
    onDelete: 'CASCADE',
  })
  user: User;
}
