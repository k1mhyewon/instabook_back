import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CommentsDto } from './dto/comments.dto';
import { commentLikeDto } from './dto/commentLikes.dto';

const prisma = new PrismaClient();

@Injectable()
export class CommentsService {
  async createComment(commentData: any) {
    const createComment = await prisma.comment.create({
      data: {
        userId: parseInt(commentData.userId),
        postId: parseInt(commentData.postId),
        content: commentData.content,
        groupNo: commentData.groupNo,
        parentCid: commentData.parentCid,
        depthNo: commentData.depthNo,
      },
    });

    const newCommentId = createComment.id;

    const newComment = await prisma.comment.findUnique({
      where: {
        id: newCommentId,
      },
      include: {
        likes: true,
        user: {
          select: { userName: true, id: true, profilePhoto: true },
        },
      },
    });
    return newComment;
  }

  async goCommentLike(commentData: any) {
    const commentLike = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId: parseInt(commentData.userId),
          commentId: parseInt(commentData.id),
        },
      },
    });
    if (commentLike) {
      await prisma.commentLike.delete({
        where: {
          userId_commentId: {
            userId: parseInt(commentData.userId),
            commentId: parseInt(commentData.id),
          },
        },
      });
    } else {
      await prisma.commentLike.create({
        data: {
          userId: parseInt(commentData.userId),
          commentId: parseInt(commentData.id),
        },
      });
    }
    return await prisma.commentLike.findMany({
      where: {
        commentId: parseInt(commentData.id),
      },
    });
  }

  async getCommentLikeBool(userId: string, commentId: string) {
    const commentLike = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId: parseInt(userId),
          commentId: parseInt(commentId),
        },
      },
    });
    if (commentLike) {
      // 데이터가 존재함
      return true;
    } else {
      // 데이터가 존재하지 않음
      return false;
    }
  }

  async getCommentWithUserInfo(commentId: string) {
    return await prisma.comment.findMany({
      where: { id: parseInt(commentId) },
      include: {
        user: true,
        post: false,
        likes: true,
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
