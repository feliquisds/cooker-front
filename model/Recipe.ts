import { Difficulty } from "./Difficulty";
import { IngredientSection } from "./IngredientSection";

export interface Recipe {
  id: string;
  authorId: string;
  bookOriginId: string;
  title: string;
  images: string[];
  tags: string[];
  difficulty: Difficulty; // Enum definida anteriormente
  timeMinutes: number;
  portions: number;
  descriptionMD: string;
  ingredientSections: IngredientSection[];
  stepsMD: string[];
  isPublic: boolean;
  createdAt: string | null; // ISO string vinda do JSON
  updatedAt: string | null;
  rating: number;
}