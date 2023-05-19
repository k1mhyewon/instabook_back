import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { GoogleStrategy } from './google.strategy';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { PostsService } from './posts/posts.service';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [AuthModule, UsersModule, PostsModule, CommentsModule],
  controllers: [AppController, UsersController],
  providers: [AppService, GoogleStrategy, PostsService],
})
export class AppModule {}
