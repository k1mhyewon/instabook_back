export class PostsDto {
  id: number;
  userId: number;
  content: string;
  uploadDate: Date;
  postPhoto?: string;
  viewCount: number;
  status: boolean;
}
