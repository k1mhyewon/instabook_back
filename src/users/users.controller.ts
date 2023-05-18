import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDto } from './dto/users.dto';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Public } from 'src/auth.decorator';
// import { AuthGuard } from '@nestjs/passport';
import { AuthGuard } from 'src/auth/auth.guard';
import { PostsService } from 'src/posts/posts.service';
import { PostsDto } from 'src/posts/dto/posts.dto';

@Controller()
export class UsersController {
  constructor(
    private usersService: UsersService,
    private postsService: PostsService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() userData: UsersDto): Promise<UsersDto> {
    return this.usersService.createUser(userData);
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
}
