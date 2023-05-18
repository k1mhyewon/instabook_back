import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PostsService } from 'src/posts/posts.service';

@Module({
  providers: [UsersService, PostsService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
