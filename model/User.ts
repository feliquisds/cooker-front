export interface User {
  id: string;
  handle: string;
  name: string;
  email: string;
  avatarUrl: string;
  bio: string;
  birthDate: string; // "YYYY-MM-DD"
  isPrivate: boolean;
  notificationTags: string[];
  favoriteRecipeIds: string[];
  savedBookIds: string[];
}