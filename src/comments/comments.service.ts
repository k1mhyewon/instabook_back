import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CommentsDto } from './dto/comments.dto';

const prisma = new PrismaClient();

@Injectable()
export class CommentsService {
  async createComment(commentData: CommentsDto) {
    return await prisma.comment.create({
      data: {
        userId: commentData.userId,
        postId: commentData.postId,
        content: commentData.content,
        groupNo: commentData.groupNo,
        parentCid: commentData.parentCid,
        depthNo: commentData.depthNo,
      },
    });
  }

  async updateComment(commentData: CommentsDto) {
    return await prisma.comment.update({
      where: { id: commentData.id },
      data: {
        content: commentData.content,
      },
    });
  }

  async deleteComment(commentData: CommentsDto) {
    return await prisma.comment.update({
      where: { id: commentData.id },
      data: {
        status: false,
      },
    });
  }
}
