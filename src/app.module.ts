import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { GoogleStrategy } from './google.strategy';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [AuthModule, UsersModule, PostsModule, CommentsModule],
  controllers: [AppController, UsersController],
  providers: [AppService, GoogleStrategy],
})
export class AppModule {}
