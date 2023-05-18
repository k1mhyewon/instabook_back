import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PostsDto } from './dto/posts.dto';
import { TagsDto } from './dto/tags.dto';

const prisma = new PrismaClient();

@Injectable()
export class PostsService {
  async createPost(postData: any) {
    // const s_userId = parseInt(postData.userId)

    return await prisma.post.create({
      data: {
        userId: parseInt(postData.userId),
        content: postData.content,
        postPhoto: postData.postPhoto ?? undefined,
      },
    });
    // {"userId": 4, "content": "글내용", "user": {"connect": { "userId": 4 }}}
  }

  async createPostWithTags(postData: any) {
    const jsonTags = postData.postTag;
    let parsedTagValues;

    let tagValueArr: string[] = [];
    if (jsonTags !== '') {
      parsedTagValues = JSON.parse(jsonTags);
      for (const item of parsedTagValues) {
        tagValueArr.push(item.value);
      }
    }

    const existingTags = await prisma.tag.findMany({
      where: {
        name: {
          in: tagValueArr,
        },
      },
    });

    const existingTagNames = existingTags.map((tag) => tag.name);
    //  조회된 태그들의 name 값 배열 - tag 테이블에 새로 생성해주지 않아도 됨

    const newTags = tagValueArr.filter(
      (tagName) => !existingTagNames.includes(tagName),
    );
    // tag 테이블에 새로 생성해야 할 tag 배열
    if (newTags.length > 0) {
      const createdTags = await prisma.tag.createMany({
        data: newTags.map((tagName) => ({ name: tagName })),
        skipDuplicates: true,
      });
    }

    await prisma.post.create({
      data: {
        userId: parseInt(postData.userId),
        content: postData.content,
        postPhoto: postData.postPhoto ?? undefined,
        ...(tagValueArr.length > 0 && {
          PostTag: {
            create: tagValueArr.map((tagName) => ({ tagName: tagName })),
          },
        }),
      },
    });
  }

  async findAllPosts(paraUserId: string) {
    // return await prisma.post.findMany({
    //   where: { userId: parseInt(paraUserId) },
    // });
    return await prisma.post.findMany({
      where: { userId: parseInt(paraUserId) },
      include: {
        likes: true,
        comments: {
          include: {
            likes: true,
            user: { select: { userName: true, id: true } },
          },
        },
        user: { select: { userName: true } },
      },
      orderBy: {
        uploadDate: 'desc',
      },
    });
  }

  async findAllPostsForHome(paraUserId: string) {
    const userFollows = await prisma.follow.findMany({
      where: {
        userFollowFrom: {
          id: parseInt(paraUserId),
        },
      },
      select: {
        followTo: true,
      },
    });

    const followToIds = userFollows.map((follow) => follow.followTo);
    followToIds.push(parseInt(paraUserId));

    // const pageNumber = 1;
    // const pageSize = 10;

    return await prisma.post.findMany({
      where: {
        userId: {
          in: followToIds,
        },
      },
      include: {
        likes: true,
        comments: {
          include: {
            likes: true,
            user: {
              select: { userName: true, id: true },
            },
          },
        },
        user: {
          select: { userName: true },
        },
      },
      orderBy: {
        uploadDate: 'desc',
      },
      // skip: (pageNumber - 1) * pageSize,
      // take: pageSize,
    });
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

  async getPostLikeBool(userId: string, postId: string) {
    const postLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId: parseInt(userId),
          postId: parseInt(postId),
        },
      },
    });
    if (postLike) {
      // 데이터가 존재함
      // console.log(true);
      return true;
    } else {
      // 데이터가 존재하지 않음
      // console.log(false);
      return false;
    }
  }

  async goLike(userId: string, postId: string) {
    const postLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId: parseInt(userId),
          postId: parseInt(postId),
        },
      },
    });
    if (postLike) {
      await prisma.postLike.delete({
        where: {
          userId_postId: {
            userId: parseInt(userId),
            postId: parseInt(postId),
          },
        },
      });
      // return true;
    } else {
      await prisma.postLike.create({
        data: {
          userId: parseInt(userId),
          postId: parseInt(postId),
        },
      });
      // return false;
    }
  }

  async getTags(postId: string) {
    const postTags = await prisma.postTag.findMany({
      where: {
        postId: parseInt(postId),
      },
    });
    return postTags;
  }

  async getPostsByTagName(tagName: string) {
    const postTags = await prisma.postTag.findMany({
      where: {
        tagName: tagName,
      },
      include: {
        post: {
          include: {
            user: true,
          },
        },
      },
    });

    return postTags;
  }
}
