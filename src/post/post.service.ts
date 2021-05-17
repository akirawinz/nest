import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as fsExtra from 'fs-extra';
import { InjectRepository } from '@nestjs/typeorm';
import { PostRepository } from './post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '../user/user.entity';
import { PostEntity } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostRepository) private postRepository: PostRepository,
  ) {}

  async getPosts() {
    return this.postRepository.getPosts();
  }

  async getPostByUserId(id: number) {
    return this.postRepository.getPostByUserId(id);
  }

  async createPost(
    createPostDto: CreatePostDto,
    user: User,
  ): Promise<PostEntity> {
    return this.postRepository.createPost(createPostDto, user);
  }

  async getPostByIdAndUserId(id: number, user: User) {
    const found = await this.postRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!found) throw new NotFoundException(`Post with ID "${id}" not found`);
    return found;
  }

  async updatePost(
    id: number,
    user: User,
    createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    const { description, image_url } = createPostDto;
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

  async deletePost(id: number, user: User): Promise<void> {
    const post = await this.getPostByIdAndUserId(id, user);
    await fsExtra.remove(`upload/${post.image_url}`);
    const result = await this.postRepository.delete({ id, userId: user.id });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
}
