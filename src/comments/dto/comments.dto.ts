export class CommentsDto {
  id: number;
  userId: number;
  postId: number;
  content: string;
  uploadDate: Date;
  groupNo: number;
  parentCid?: number;
  depthNo?: number;
  status: boolean;
}
