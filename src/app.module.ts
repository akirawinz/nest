import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './config/typeorm.config';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'upload'),
    }),
    AuthModule,
    UserModule,
    PostModule,
    CommentModule,
  ],
})
export class AppModule {}
