import { RecipeRequestResponse } from "./RecipeRequestResponse";

export interface RecipeRequest {
  id: string;
  requesterId: string;
  title: string;
  descriptionMD: string;
  tags: string[];
  responses: RecipeRequestResponse[];
  createdAt: string;
  manuallyClosed: boolean;
}

export const RecipeRequestLogic = {
  isActive: (req: RecipeRequest): boolean => {
    if (req.manuallyClosed) return false;
    const createdDate = new Date(req.createdAt);
    const expirationDate = new Date(createdDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    return expirationDate > new Date();
  }
};