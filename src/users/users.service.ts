import { Injectable } from '@nestjs/common';
import { UsersDto } from './dto/users.dto';
import { PrismaClient } from '@prisma/client';
import { Request } from 'express';

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

  async findUser(userId: string) {
    return await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });
  }

  async findUserWithFollow(userId: string) {
    return await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: {
        followFrom: {
          include: {
            userFollowTo: {},
          },
        },
        followTo: {
          include: {
            userFollowFrom: {},
          },
        },
      },
    });
  }
  // select: { userName: true, profilePhoto: true }

  async createFollow(followFrom: string, followTo: string) {
    try {
      const newFollow = await prisma.follow.create({
        data: {
          followFrom: parseInt(followFrom),
          followTo: parseInt(followTo),
        },
      });

      console.log('New follow created:', newFollow);
    } catch (error) {
      console.error('Error creating follow:', error);
    } finally {
      // await prisma.$disconnect();
    }
  }

  async deleteFollow(followFrom, followTo) {
    try {
      const deletedFollow = await prisma.follow.delete({
        where: {
          followTo_followFrom: {
            followFrom: parseInt(followFrom),
            followTo: parseInt(followTo),
          },
        },
      });

      console.log('Deleted follow:', deletedFollow);
    } catch (error) {
      console.error('Error deleting follow:', error);
    } finally {
      await prisma.$disconnect();
    }
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
