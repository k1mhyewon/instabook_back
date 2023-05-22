import {
  Body,
  Bind,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostsDto } from './dto/posts.dto';
import { PostsService } from './posts.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/common/auth/auth.decorator';
import { PostTag } from '@prisma/client';
import { MulterOptions } from 'src/multer.options';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UsersService } from 'src/users/users.service';

@Controller('post')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private usersService: UsersService,
  ) {}

  // @UseGuards(JwtAuthGuard)
  @Get('write')
  getProfile(@Request() req) {
    return req.user;
  }

  //   @UseGuards(JwtAuthGuard)
  // @UseGuards(AuthGuard)
  @Public()
  @Post('write')
  @UseInterceptors(FilesInterceptor('files', null, MulterOptions))
  @Bind(UploadedFiles())
  async createPost(
    @UploadedFile() files: Express.Multer.File[], // 파일을 @UploadedFile() 데코레이터로 받아옴
    @Body() postData: PostsDto,
    @Res() res: Response,
  ) {
    const postPhoto = files
      ? this.usersService.uploadFileDisk(files)
      : undefined;

    if (postPhoto !== undefined) {
      postData = {
        ...postData,
        postPhoto: postPhoto.length > 0 ? postPhoto[0] : null,
      };
    }
    await this.postsService.createPostWithTags(postData);

    res.status(HttpStatus.OK).json({
      success: true,
      data: postData,
    });
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
  ): Promise<any> {
    return this.postsService.goLike(userId, postId);
  }

  @Public()
  @Get('/tags/:postId')
  async getTags(@Param('postId') postId: string): Promise<PostTag[]> {
    return this.postsService.getTags(postId);
  }
}
