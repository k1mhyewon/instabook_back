import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { PrismaClient } from '@prisma/client';
import { CommentsDto } from './dto/comments.dto';
import { Public } from 'src/auth.decorator';

@Controller('comment')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  // @Public()
  @Get('/:commentId')
  async getCommentWithUserInfo(@Param('commentId') commentId: string) {
    return this.commentsService.getCommentWithUserInfo(commentId);
  }

  @Public()
  @Post('write')
  async createPost(@Body() commentData: CommentsDto): Promise<CommentsDto> {
    return this.commentsService.createComment(commentData);
  }

  @Post('edit')
  async updatePost(@Body() commentData: CommentsDto): Promise<CommentsDto> {
    return this.commentsService.updateComment(commentData);
  }

  @Post('delete')
  async deletePost(@Body() commentData: CommentsDto): Promise<CommentsDto> {
    return this.commentsService.deleteComment(commentData);
  }
}
