import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [PostsController],
  providers: [UsersService, PostsService],
})
export class PostsModule {}
