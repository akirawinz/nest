import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntityRepository } from './post.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntityRepository]), AuthModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
