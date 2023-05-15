import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostsDto } from './dto/posts.dto';
import { PostsService } from './posts.service';

@Controller('post')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('write')
  getProfile(@Request() req) {
    return req.user;
  }

  //   @UseGuards(JwtAuthGuard)
  @Post('write')
  async createPost(@Body() postData: PostsDto): Promise<PostsDto> {
    return this.postsService.createPost(postData);
  }

  @Post('edit')
  async updatePost(@Body() postData: PostsDto): Promise<PostsDto> {
    return this.postsService.updatePost(postData);
  }

  @Post('delete')
  async deletePost(@Body() postData: PostsDto): Promise<PostsDto> {
    return this.postsService.deletePost(postData);
  }
}
