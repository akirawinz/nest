import { EntityRepository, Repository } from 'typeorm';
import { CommentEntity } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserEntity } from '../user/entities/user.entity';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(CommentEntity)
export class CommentRepository extends Repository<CommentEntity> {
  async createComment(
    createCommentDto: CreateCommentDto,
    user: UserEntity,
  ): Promise<CommentEntity> {
    const { postId, description } = createCommentDto;
    const comment = new CommentEntity();
    comment.description = description;
    comment.user = user;
    comment.postId = postId;
    try {
      await comment.save();
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
    console.log(comment);
    return comment;
  }
}
