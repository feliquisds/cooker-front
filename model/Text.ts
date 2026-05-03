export interface Text {
  id: string;
  authorId: string;
  title: string;
  tags: string[];
  contentMD: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}