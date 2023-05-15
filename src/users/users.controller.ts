import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDto } from './dto/users.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Public } from 'src/auth.decorator';

@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @Post('register')
  async register(@Body() userData: UsersDto): Promise<UsersDto> {
    return this.usersService.createUser(userData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    const jwtCookie = req.cookies['jwt'];
    return jwtCookie;
    // return req.user;
  }

  @Post('profile/edit')
  async editUserInfo(@Body() userData: UsersDto): Promise<UsersDto> {
    return this.usersService.updateUser(userData);
  }

  @Post('profile/edit/password')
  async editUserPwd(@Body() userData: UsersDto): Promise<UsersDto> {
    return this.usersService.updateUserPwd(userData);
  }
}
