import { Body, Controller, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { PrismaClient } from '@prisma/client';
import { CommentsDto } from './dto/comments.dto';

@Controller('comment')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

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
