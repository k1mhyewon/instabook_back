import {
  Bind,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Request,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDto } from './dto/users.dto';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Public } from 'src/auth.decorator';
// import { AuthGuard } from '@nestjs/passport';
import { AuthGuard } from 'src/auth/auth.guard';
import { PostsService } from 'src/posts/posts.service';
import { PostsDto } from 'src/posts/dto/posts.dto';
import { MulterOptions } from 'src/multer.options';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller()
export class UsersController {
  constructor(
    private usersService: UsersService,
    private postsService: PostsService,
  ) {}

  // @Public()
  // @Post('register')
  // async register(@Body() userData: UsersDto): Promise<UsersDto> {
  //   return this.usersService.createUser(userData);
  // }

  @Public()
  // @UseGuards(AuthGuard)
  @Post('/register')
  // @UseInterceptors(AnyFilesInterceptor(MulterOptions)) // AnyFilesInterceptor 사용
  @UseInterceptors(FilesInterceptor('files', null, MulterOptions))
  @Bind(UploadedFiles())
  async register(
    @UploadedFile() files: Express.Multer.File[], // 파일을 @UploadedFile() 데코레이터로 받아옴
    @Body() userData: UsersDto, // 문자열 필드를 @Body() 데코레이터로 받아옴
    @Res() res: Response,
  ) {
    const profilePhoto = files
      ? this.usersService.uploadFileDisk(files)
      : undefined;

    if (profilePhoto !== undefined) {
      userData = {
        ...userData,
        profilePhoto: profilePhoto.length > 0 ? profilePhoto[0] : null,
      };
    }

    await this.usersService.createUser(userData); // 사용자 생성 메서드 호출

    res.status(HttpStatus.OK).json({
      success: true,
      data: userData,
    });
  }

  @UseGuards(AuthGuard)
  @Get('getUserInfo')
  getUserInfo(@Request() req) {
    return req.user;
  }

  // @UseGuards(AuthGuard)
  @Public()
  @Get('profile/:userId')
  getProfile(@Param('userId') userId: string) {
    return this.usersService.findUserWithFollow(userId);
  }

  @Public()
  @Get('profileOnly/:userId')
  getProfileOnly(@Param('userId') userId: string) {
    return this.usersService.findUser(userId);
  }

  // @UseGuards(AuthGuard)
  @Public()
  @Get('profile/:userId/follows')
  getFollowers(@Param('userId') userId: string) {
    return this.usersService.findUserWithFollow(userId);
  }

  // @Public()
  // @Get('profile/:userId/following')
  // getFollowing(@Param('userId') userId: string) {
  //   return this.usersService.findUserWithFollow(userId);
  // }

  @Public()
  @Get('profile/:userId/posts')
  async findAllPosts(@Param('userId') userId: string): Promise<PostsDto[]> {
    return this.postsService.findAllPosts(userId);
  }

  @Public()
  @Get('profile/goFollow/:followFrom/:followTo')
  async goFollow(
    @Param('followFrom') followFrom: string,
    @Param('followTo') followTo: string,
  ) {
    this.usersService.createFollow(followFrom, followTo);
  }

  @Public()
  @Get('profile/goUnfollow/:followFrom/:followTo')
  async goUnfollow(
    @Param('followFrom') followFrom: string,
    @Param('followTo') followTo: string,
  ) {
    this.usersService.deleteFollow(followFrom, followTo);
  }

  @Post('profile/edit')
  async editUserInfo(@Body() userData: UsersDto): Promise<UsersDto> {
    return this.usersService.updateUser(userData);
  }

  @Post('profile/edit/password')
  async editUserPwd(@Body() userData: UsersDto): Promise<UsersDto> {
    return this.usersService.updateUserPwd(userData);
  }

  @Public()
  @Get('home/:userId')
  async findAllPostsForHome(
    @Param('userId') userId: string,
  ): Promise<PostsDto[]> {
    return this.postsService.findAllPostsForHome(userId);
  }

  @Public()
  @Get('search/:tagName')
  async getPostsByTagName(@Param('tagName') tagName: string) {
    return this.postsService.getPostsByTagName(tagName);
  }

  /*
    디스크 방식 파일 업로드 (1)-> Destination 옵션 설정
    @param {File[]} files 다중 파일
    @param res Response 객체
   */
}
