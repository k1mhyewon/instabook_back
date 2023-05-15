import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { UsersDto } from 'src/users/dto/users.dto';
import { AuthDto } from './dto/auth.dto';

const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // async signIn(authDto: AuthDto): Promise<{ access_token: string }> {
  async signIn(authDto: AuthDto) {
    const user = await prisma.user.findFirst({
      where: {
        userName: authDto.userName,
      },
    });
    if (user?.password !== authDto.password) {
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
