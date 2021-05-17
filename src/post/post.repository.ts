import { EntityRepository, Repository } from 'typeorm';
import { PostEntity } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '../user/user.entity';

@EntityRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> {
  async getPosts() {
    let posts = await this.createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.comment', 'comment')
      .leftJoinAndSelect('comment.user', 'commentedUser')
      .select([
        'post',
        'user.id',
        'user.username',
        'comment',
        'commentedUser.username',
        'commentedUser.id',
      ])
      .orderBy('post.updated_at', 'DESC')
      .getMany();
    posts = posts.map((post) => {
      post.comment.sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      );
      return post;
    });
    return posts;
    // return this.find({ relations: ['user', 'comment', 'comment.getUser'] });
  }

  async getPostByUserId(id) {
    return this.createQueryBuilder('post')
      .where('post.userId = :id', { id: id })
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.comment', 'comment')
      .select(['post', 'user.id', 'user.username', 'comment'])
      .getMany();
  }
  async createPost(
    createPostDto: CreatePostDto,
    user: User,
  ): Promise<PostEntity> {
    const { description, image_url } = createPostDto;
    const post = new PostEntity();
    post.userId = user.id;
    post.description = description;
    post.image_url = image_url;
    await post.save();
    return post;
  }
}
