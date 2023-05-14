import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDto } from './dto/users.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  async register(@Body() userData: UsersDto): Promise<UsersDto> {
    return this.usersService.createUser(userData);
  }

  @Post('profile/edit')
  async editUserInfo(@Body() userData: UsersDto): Promise<UsersDto> {
    return this.usersService.updateUser(userData);
  }

  @Post('profile/password')
  async editUserPwd(@Body() userData: UsersDto): Promise<UsersDto> {
    return this.usersService.updateUserPwd(userData);
  }
}
