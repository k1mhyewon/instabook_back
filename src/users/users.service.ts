import { Injectable } from '@nestjs/common';
import { UsersDto } from './dto/users.dto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
@Injectable()
export class UsersService {
  // private readonly users: UsersDto[] = [
  //   {
  //     id: 1,
  //     userName: 'kimhw',
  //     password: '1234',
  //     name: '김혜원',
  //   },
  //   {
  //     id: 2,
  //     userName: 'maria',
  //     password: 'guess',
  //     name: '마리아',
  //   },
  // ];

  // async findOne(userName: string): Promise<UsersDto | undefined> {
  //   return this.users.find((user) => user.userName === userName);
  // }

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
