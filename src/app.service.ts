import axios from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }

  kakaoLogin(req) {
    if (!req.user) {
      return 'No user from kakao';
    }

    return {
      message: 'User information from kakao',
      user: req.user,
    };
  }

  async kakaoToken(code) {
    console.log(code);
    const tokenResponse = await axios.post(
      `https://kauth.kakao.com/oauth/token`,
      {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        body: {
          grant_type: 'authorization_code',
          client_id: process.env.KAKAO_REST_API_KEY,
          redirect_uri: process.env.KAKAO_REDIRECT_URI,
          code: code,
          client_secret: process.env.KAKAO_CLIENT_SECRET,
        },
      },
    );
    console.log(tokenResponse);
    const accessToken = tokenResponse.data.access_token;
    console.log(accessToken);
  }
}
