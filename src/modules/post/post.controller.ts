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
import { PostService, PostEntity } from '@modules/post';
import { GetUser } from '@common/decorators/request/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { PostDto } from './dto/post.dto';
import { uploadImagePath } from '@common/utils/file-uploading.utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDto } from '@modules/user/dto/user.dto';

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
  getPostByIdAndUserId(@Param('id') id: number, @GetUser() user: UserDto) {
    return this.postService.getPostByIdAndUserId(id, user);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', uploadImagePath()))
  createPost(
    @UploadedFile(ValidationPipe) file,
    @Body() createPostDto: PostDto,
    @GetUser() user: UserDto,
  ): Promise<PostEntity> {
    createPostDto.image_url = file.filename;
    return this.postService.createPost(createPostDto, user);
  }

  @Put('/:id/update')
  @UseInterceptors(FileInterceptor('image', uploadImagePath()))
  updatePost(
    @Param('id') id: number,
    @UploadedFile(ValidationPipe) file,
    @Body(ValidationPipe) createPostDto: PostDto,
    @GetUser() user: UserDto,
  ): Promise<PostEntity> {
    if (file) {
      createPostDto.image_url = file.filename;
    }
    return this.postService.updatePost(id, user, createPostDto);
  }

  @Delete('/:id')
  deletePost(@Param('id') id: number, @GetUser() user: UserDto): Promise<void> {
    return this.postService.deletePost(id, user);
  }
}
