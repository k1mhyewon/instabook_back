import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
// import { ConfigService } from '@nestjs/config';

// const fromAuthCookie = function () {
//   return function (request) {
//     let token = null;
//     if (request && request.cookies) {
//       token = request.cookies['Authorization'];
//     }
//     return token;
//   };
// };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // constructor(private readonly config: ConfigService) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // jwtFromRequest: ExtractJwt.fromExtractors([
      //   (request) => {
      //     return request?.cookies?.Authorization;
      //   },
      // ]),

      // jwtFromRequest: fromAuthCookie(),
      // Request에서 JWT를 추출하는 방법 중 Header에 Bearer Token 사용
      // ExtractJwt.fromAuthHeaderAsBearerToken()
      ignoreExpiration: false,
      // jwt 보증을 passport 모듈에 위임함. 만료된 JWT인경우 request거부, 401 response
      secretOrKey: jwtConstants.secret, // token 발급에 사용할 시크릿 키
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, userName: payload.userName };
  }
}
