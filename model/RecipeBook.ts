import { BookComponent } from "./BookComponent";

export interface RecipeBook {
  id: string;
  ownerId: string;
  title: string;
  descriptionMD: string;
  tags: string[];
  isPublic: boolean;
  items: BookComponent[];
  createdAt: string | null;
  updatedAt: string | null;
}