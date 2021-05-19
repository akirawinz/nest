import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserEntity } from '../user/entities/user.entity';
import { CommentDto } from './dto/comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentRepository)
    private commentRepository: CommentRepository,
  ) {}
  async createComment(
    createCommentDto: CreateCommentDto,
    user: UserEntity,
  ): Promise<CommentDto> {
    const {
      id,
      description,
      postId,
    } = await this.commentRepository.createComment(createCommentDto, user);
    return { id, description, postId };
  }

  async getCommentByIdAndUserId(id: number, user: UserEntity) {
    const comment = await this.commentRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!comment)
      throw new NotFoundException(`Comment with ID "${id}" not found`);
    return comment;
  }

  async updateComment(
    id: number,
    createCommentDto: CreateCommentDto,
    user: UserEntity,
  ): Promise<CommentDto> {
    const { description } = createCommentDto;

    try {
      const comment = await this.getCommentByIdAndUserId(id, user);
      comment.description = description;

      await comment.save();

      return {
        id: comment.id,
        description: comment.description,
        postId: comment.postId,
      };
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async deleteComment(id: number, user: UserEntity): Promise<void> {
    const result = await this.commentRepository.delete({ id, userId: user.id });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
}
