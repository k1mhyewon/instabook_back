import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
// import { Request } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }
  // constructor(private authService: AuthService, private moduleRef: ModuleRef) {
  //   super({
  //     passReqToCallback: true,
  //   });
  // }

  async validate(
    // request: Request,
    userName: string,
    password: string,
  ): Promise<any> {
    // const contextId = ContextIdFactory.getByRequest(request);
    // // "AuthService" is a request-scoped provider
    // const authService = await this.moduleRef.resolve(AuthService, contextId);

    const user = await this.authService.validateUser(userName, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
