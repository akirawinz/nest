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
import { User } from '../../user/entities/user.entity';
import { CommentEntity } from '../../comment/entities/comment.entity';

@Entity({ name: 'post' })
export class PostEntity extends BaseEntity {
  /**
   * post id
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * image url
   */
  @Column()
  image_url: string;

  /**
   * description
   */
  @Column()
  description: string;

  /**
   * creator's userId
   */
  @Column()
  userId: number;

  /**
   * when it's created
   */
  @CreateDateColumn()
  created_at: Date;

  /**
   * when it's last updated
   */
  @UpdateDateColumn()
  updated_at: Date;

  /**
   * ???
   */
  @ManyToOne(() => User, (user) => user.posts, {
    eager: false,
    onDelete: 'CASCADE',
  })
  user: User[];

  /**
   * comments on this post
   */
  @OneToMany(() => CommentEntity, (comment: CommentEntity) => comment.post, {
    eager: true,
    onDelete: 'CASCADE',
  })
  comment: CommentEntity[];
}
