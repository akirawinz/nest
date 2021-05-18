import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '../user/user.entity';
import { CommentEntity } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentRepository)
    private commentRepository: CommentRepository,
  ) {}
  async createComment(
    createCommentDto: CreateCommentDto,
    user: User,
  ): Promise<CommentEntity> {
    return this.commentRepository.createComment(createCommentDto, user);
  }

  async getCommentByIdAndUserId(id: number, user: User) {
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
    user: User,
  ): Promise<CommentEntity> {
    const { description } = createCommentDto;
    const comment = await this.getCommentByIdAndUserId(id, user);
    comment.description = description;
    try {
      await comment.save();
    } catch (e) {
      throw new InternalServerErrorException();
    }
    return comment;
  }

  async deleteComment(id: number, user: User): Promise<void> {
    const result = await this.commentRepository.delete({ id, userId: user.id });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
}
