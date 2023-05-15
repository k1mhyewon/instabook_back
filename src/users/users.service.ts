import { Injectable } from '@nestjs/common';
import { UsersDto } from './dto/users.dto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
@Injectable()
export class UsersService {
  async createUser(userData: UsersDto) {
    return await prisma.user.create({
      data: {
        name: userData.name,
        userName: userData.userName,
        password: userData.password,
        userInfo: userData.userInfo ?? undefined,
        profilePhoto: userData.profilePhoto ?? undefined,
      },
    });
  }

  async updateUser(userData: UsersDto) {
    return await prisma.user.update({
      where: { id: userData.id },
      data: {
        name: userData.name,
        userName: userData.userName,
        password: userData.password,
        userInfo: userData.userInfo ?? undefined,
        profilePhoto: userData.profilePhoto ?? undefined,
      },
    });
  }

  async updateUserPwd(userData: UsersDto) {
    return await prisma.user.update({
      where: { id: userData.id },
      data: {
        password: userData.password,
      },
    });
  }
}
