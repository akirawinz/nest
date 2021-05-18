import {
  Post,
  Body,
  Controller,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
  Put,
  Param,
  Get,
  Delete,
} from '@nestjs/common';
import { PostService } from './post.service';
import { GetUser } from '../user/get-user.decorator';
import { User } from '../user/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostDto } from './dto/create-post.dto';
import { uploadImagePath } from '../utils/file-uploading.utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostEntity } from './post.entity';

@UseGuards(AuthGuard())
@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  getAllPost() {
    return this.postService.getPosts();
  }

  @Get('getPostByUserId/:id')
  getPostByUserId(@Param('id') id: number) {
    return this.postService.getPostByUserId(id);
  }

  @Get('/:id')
  getPostByIdAndUserId(@Param('id') id: number, @GetUser() user: User) {
    return this.postService.getPostByIdAndUserId(id, user);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', uploadImagePath()))
  createPost(
    @UploadedFile(ValidationPipe) file,
    @Body() createPostDto: CreatePostDto,
    @GetUser() user: User,
  ): Promise<PostEntity> {
    createPostDto.image_url = file.filename;
    return this.postService.createPost(createPostDto, user);
  }

  @Put('/:id/update')
  @UseInterceptors(FileInterceptor('image', uploadImagePath()))
  updatePost(
    @Param('id') id: number,
    @UploadedFile(ValidationPipe) file,
    @Body(ValidationPipe) createPostDto: CreatePostDto,
    @GetUser() user: User,
  ): Promise<PostEntity> {
    if (file) {
      createPostDto.image_url = file.filename;
    }
    return this.postService.updatePost(id, user, createPostDto);
  }

  @Delete('/:id')
  deletePost(@Param('id') id: number, @GetUser() user: User): Promise<void> {
    return this.postService.deletePost(id, user);
  }
}
