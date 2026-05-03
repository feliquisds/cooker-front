export interface RecipeRequestResponse {
  responderId: string; // ObjectId no banco
  recipeId: string;    // ObjectId no banco
  messageMD: string;
  createdAt: string;   // ISO Date string
}