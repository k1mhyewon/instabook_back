import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PostsDto } from './dto/posts.dto';

const prisma = new PrismaClient();

@Injectable()
export class PostsService {
  async createPost(postData: PostsDto) {
    return await prisma.post.create({
      data: {
        userId: postData.userId,
        content: postData.content,
        postPhoto: postData.postPhoto ?? undefined,
      },
    });
    // {"userId": 4, "content": "글내용", "user": {"connect": { "userId": 4 }}}
  }

  async updatePost(postData: PostsDto) {
    return await prisma.post.update({
      where: { id: postData.id },
      data: {
        content: postData.content,
        postPhoto: postData.postPhoto ?? undefined,
      },
    });
  }

  async deletePost(postData: PostsDto) {
    return await prisma.post.update({
      where: { id: postData.id },
      data: {
        status: false,
      },
    });
  }
}
