import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as fsExtra from 'fs-extra';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntityRepository } from './post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UserDto } from '@modules/user/dto/user.dto';
import { PostDto } from './dto/post.dto';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntityRepository)
    private postRepository: PostEntityRepository,
  ) {}

  async getPosts(): Promise<PostDto[]> {
    const postEntities = await this.postRepository.getPosts();

    return postEntities.map((pe) => ({
      id: pe.id,
      description: pe.description,
      image_url: pe.image_url,
    }));
  }

  async getPostByUserId(id: number): Promise<PostDto[]> {
    const postEntities = await this.postRepository.getPostByUserId(id);
    return postEntities.map((pe) => ({
      id: pe.id,
      description: pe.description,
      image_url: pe.image_url,
    }));
  }

  async createPost(
    createPostDto: CreatePostDto,
    user: UserDto,
  ): Promise<PostDto> {
    const { id, description, image_url } = await this.postRepository.createPost(
      createPostDto,
      user,
    );
    return { id, description, image_url };
  }

  async getPostByIdAndUserId(id: number, user: UserDto): Promise<PostDto> {
    const found = await this.getPostEntityByIdAndUserId(id, user);
    return {
      id: found.id,
      description: found.description,
      image_url: found.image_url,
    };
  }

  async getPostEntityByIdAndUserId(
    id: number,
    user: UserDto,
  ): Promise<PostEntity> {
    const found = await this.postRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!found) throw new NotFoundException(`Post with ID "${id}" not found`);

    return found;
  }

  async updatePost(
    id: number,
    user: UserDto,
    createPostDto: CreatePostDto,
  ): Promise<PostDto> {
    try {
      const { description, image_url } = createPostDto;

      const post = await this.getPostEntityByIdAndUserId(id, user);
      post.description = description;

      if (image_url) {
        await fsExtra.remove(`upload/${post.image_url}`);
        post.image_url = image_url;
      }

      await post.save();

      return {
        id: post.id,
        description: post.description,
        image_url: post.image_url,
      };
    } catch (e) {
      throw new InternalServerErrorException();
    }
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
