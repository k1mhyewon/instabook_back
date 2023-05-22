import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { Public } from './common/auth/auth.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Public()
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.appService.googleLogin(req);
  }

  @Public()
  @Get('/kakao-callback')
  @UseGuards(AuthGuard('kakao'))
  kakaoAuthRedirect(@Req() req) {
    console.log('req');
    console.log(req);
    return this.appService.kakaoLogin(req);
  }

  @Public()
  @Post('/kakao-callback')
  KakaoToken(@Query('authorizationCode') code: string) {
    return this.appService.kakaoToken(code);
  }
}
