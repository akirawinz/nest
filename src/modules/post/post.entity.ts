import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { CommentEntity } from '../comment/comment.entity';

@Entity({ name: 'post' })
export class PostEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  image_url: string;
  @Column()
  description: string;
  @Column()
  userId: number;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
  @ManyToOne(() => User, (user) => user.posts, {
    eager: false,
    onDelete: 'CASCADE',
  })
  user: User[];
  @OneToMany(() => CommentEntity, (comment: CommentEntity) => comment.post, {
    eager: true,
    onDelete: 'CASCADE',
  })
  comment: CommentEntity[];
}
