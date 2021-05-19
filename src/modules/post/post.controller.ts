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
import { GetUser } from '@common/decorators/request/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostDto } from './dto/create-post.dto';
import { uploadImagePath } from '@common/utils/file-uploading.utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDto } from '@modules/user/dto/user.dto';
import { PostService } from './post.service';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PostDto } from './dto/post.dto';

@ApiBearerAuth()
@ApiTags('post')
@UseGuards(AuthGuard('jwt'))
@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @ApiOkResponse({
    description: 'All posts has been fetched.',
    type: [PostDto],
  })
  @Get()
  getAllPosts(): Promise<PostDto[]> {
    return this.postService.getPosts();
  }

  @ApiParam({
    name: 'id',
    required: true,
    description: 'id of user who owns posts.',
  })
  @ApiOkResponse({
    description: 'All posts has been fetched by user id.',
    type: [PostDto],
  })
  @Get('getPostByUserId/:id')
  getPostByUserId(@Param('id') id: number): Promise<PostDto[]> {
    return this.postService.getPostByUserId(id);
  }

  @ApiParam({
    name: 'id',
    required: true,
    description: 'post id',
  })
  @ApiOkResponse({
    description: 'The post has been fetched by post id and user id.',
    type: PostDto,
  })
  @Get('/:id')
  getPostByIdAndUserId(
    @Param('id') id: number,
    @GetUser() user: UserDto,
  ): Promise<PostDto> {
    return this.postService.getPostByIdAndUserId(id, user);
  }

  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    description:
      'The post has been created, and you can access the uploaded image by using image_url.',
    type: PostDto,
  })
  @Post()
  @UseInterceptors(FileInterceptor('image', uploadImagePath()))
  createPost(
    @UploadedFile(ValidationPipe) file,
    @Body() createPostDto: CreatePostDto,
    @GetUser() user: UserDto,
  ): Promise<PostDto> {
    createPostDto.image_url = file.filename;
    return this.postService.createPost(createPostDto, user);
  }

  @ApiOkResponse({
    description:
      'The post has been updated, and you can access the updated image by using image_url.',
    type: PostDto,
  })
  @Put('/:id/update')
  @UseInterceptors(FileInterceptor('image', uploadImagePath()))
  updatePost(
    @Param('id') id: number,
    @UploadedFile(ValidationPipe) file,
    @Body(ValidationPipe) createPostDto: CreatePostDto,
    @GetUser() user: UserDto,
  ): Promise<PostDto> {
    if (file) {
      createPostDto.image_url = file.filename;
    }
    return this.postService.updatePost(id, user, createPostDto);
  }

  @ApiOkResponse({
    description: 'The post and it corelated image has been deleted.',
    type: PostDto,
  })
  @Delete('/:id')
  deletePost(@Param('id') id: number, @GetUser() user: UserDto): Promise<void> {
    return this.postService.deletePost(id, user);
  }
}
