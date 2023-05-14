import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { UsersDto } from 'src/users/dto/users.dto';

const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(userName: string, password: string) {
    const user = await prisma.user.findFirst({
      where: {
        userName: userName,
      },
    });
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }

    const payload = { userName: user.userName, sub: user.id };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateUser(userName: string, password: string) {
    const user: UsersDto = await prisma.user.findFirst({
      where: {
        userName: userName,
      },
    });

    if (user && user.password === password) {
      return user;
    }

    return null;
  }

  async login(user: UsersDto) {
    const payload = { userName: user.userName, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
