import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../user/get-user.decorator';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '../user/user.entity';
import { CommentEntity } from './comment.entity';

@Controller('comment')
@UseGuards(AuthGuard())
export class CommentController {
  constructor(private commentService: CommentService) {}
  @Post()
  createComment(
    @Body(ValidationPipe) createCommentDto: CreateCommentDto,
    @GetUser() user: User,
  ): Promise<CommentEntity> {
    return this.commentService.createComment(createCommentDto, user);
  }

  @Put('/:id/update')
  updateComment(
    @GetUser() user: User,
    @Body(ValidationPipe) createCommentDto: CreateCommentDto,
    @Param('id') id: number,
  ): Promise<CommentEntity> {
    return this.commentService.updateComment(id, createCommentDto, user);
  }
  @Delete('/:id')
  deleteComment(@Param('id') id: number, @GetUser() user: User) {
    return this.commentService.deleteComment(id, user);
  }
}
