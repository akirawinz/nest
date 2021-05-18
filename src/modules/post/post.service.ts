import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as fsExtra from 'fs-extra';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntityRepository } from './post.repository';
import { PostDto } from './dto/post.dto';
import { PostEntity } from './entities/post.entity';
import { UserDto } from '@modules/user/dto/user.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntityRepository)
    private postRepository: PostEntityRepository,
  ) {}

  async getPosts() {
    return this.postRepository.getPosts();
  }

  async getPostByUserId(id: number) {
    return this.postRepository.getPostByUserId(id);
  }

  async createPost(postDto: PostDto, user: UserDto): Promise<PostEntity> {
    return this.postRepository.createPost(postDto, user);
  }

  async getPostByIdAndUserId(id: number, user: UserDto) {
    const found = await this.postRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!found) throw new NotFoundException(`Post with ID "${id}" not found`);
    return found;
  }

  async updatePost(
    id: number,
    user: UserDto,
    postDto: PostDto,
  ): Promise<PostEntity> {
    const { description, image_url } = postDto;
    const post = await this.getPostByIdAndUserId(id, user);
    post.description = description;
    if (image_url) {
      await fsExtra.remove(`upload/${post.image_url}`);
      post.image_url = image_url;
    }
    try {
      await post.save();
    } catch (e) {
      throw new InternalServerErrorException();
    }
    return post;
  }

  async deletePost(id: number, user: UserDto): Promise<void> {
    const post = await this.getPostByIdAndUserId(id, user);
    await fsExtra.remove(`upload/${post.image_url}`);
    const result = await this.postRepository.delete({ id, userId: user.id });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
}
