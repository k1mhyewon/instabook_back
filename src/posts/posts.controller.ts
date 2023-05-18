import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostsDto } from './dto/posts.dto';
import { PostsService } from './posts.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/auth.decorator';
import { PostTag } from '@prisma/client';

@Controller('post')
export class PostsController {
  constructor(private postsService: PostsService) {}

  // @UseGuards(JwtAuthGuard)
  @Get('write')
  getProfile(@Request() req) {
    return req.user;
  }

  //   @UseGuards(JwtAuthGuard)
  // @UseGuards(AuthGuard)
  @Public()
  @Post('write')
  async createPost(@Body() postData: PostsDto): Promise<void> {
    return this.postsService.createPostWithTags(postData);
  }
  //Promise<PostsDto>

  @Post('edit')
  async updatePost(@Body() postData: PostsDto): Promise<PostsDto> {
    return this.postsService.updatePost(postData);
  }

  @Post('delete')
  async deletePost(@Body() postData: PostsDto): Promise<PostsDto> {
    return this.postsService.deletePost(postData);
  }

  @Public()
  @Get('/likes/userLike/:userId/:postId')
  async getPostLikeBool(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ): Promise<boolean> {
    return this.postsService.getPostLikeBool(userId, postId);
  }

  @Public()
  @Get('/likes/goLike/:userId/:postId')
  async goLike(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ): Promise<void> {
    return this.postsService.goLike(userId, postId);
  }

  @Public()
  @Get('/tags/:postId')
  async getTags(@Param('postId') postId: string): Promise<PostTag[]> {
    return this.postsService.getTags(postId);
  }
}
