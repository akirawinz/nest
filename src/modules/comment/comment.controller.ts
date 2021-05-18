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
import { GetUser } from '@common/decorators/request/get-user.decorator';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserEntity } from '@modules/user/entities/user.entity';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CommentDto } from './dto/comment.dto';

@ApiBearerAuth()
@ApiTags('comment')
@Controller('comment')
@UseGuards(AuthGuard('jwt'))
export class CommentController {
  constructor(private commentService: CommentService) {}

  @ApiCreatedResponse({
    description: 'The comment has been successfully created.',
    type: CommentDto,
  })
  @Post()
  createComment(
    @Body(ValidationPipe) createCommentDto: CreateCommentDto,
    @GetUser() user: UserEntity,
  ): Promise<CommentDto> {
    return this.commentService.createComment(createCommentDto, user);
  }

  @ApiParam({ name: 'id', required: true, description: 'updated comment id' })
  @ApiOkResponse({
    description:
      'The comment has been successfully updated. The response is the updated comment.',
    type: CommentDto,
  })
  @Put('/:id/update')
  updateComment(
    @GetUser() user: UserEntity,
    @Body(ValidationPipe) createCommentDto: CreateCommentDto,
    @Param('id') id: number,
  ): Promise<CommentDto> {
    return this.commentService.updateComment(id, createCommentDto, user);
  }

  @ApiParam({ name: 'id', required: true, description: 'deleted comment id' })
  @ApiOkResponse({
    description: 'The comment has been successfully deleted.',
  })
  @Delete('/:id')
  deleteComment(@Param('id') id: number, @GetUser() user: UserEntity) {
    return this.commentService.deleteComment(id, user);
  }
}
