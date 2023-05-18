import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Request,
  ValidationPipe,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';
import { Public } from 'src/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @HttpCode(HttpStatus.OK)
  @Public()
  @Post('/login')
  async signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }

  // @Post('/logIn')
  // async signIn(
  //   @Body(ValidationPipe) authDto: AuthDto,
  //   @Res({ passthrough: true }) response: Response,
  //   // ): Promise<{ accessToken: string }> {
  // ) {
  //   console.log('로그인');

  //   const access_token = await this.authService.signIn(authDto);
  //   // 토큰쿠키저장
  //   response.cookie('Authentication', access_token, {
  //     domain: 'localhost',
  //     path: '/',
  //     httpOnly: true,
  //   });
  //   console.log('res', response);
  //   // return access_token;
  // }

  // @Get("login/google")
  // @UseGuards(AuthGuard("google"))
  // async loginGoogle(@Req() req: Request & IOAuthUser)

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
