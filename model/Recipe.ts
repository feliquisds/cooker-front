import { Difficulty } from "./Difficulty";
import { Ingredient } from "./Ingredient";

export interface Recipe {
  id: string;
  authorId: string;
  title: string;
  images: string[];
  tags: string[];
  difficulty: Difficulty; // Enum definida anteriormente
  timeMinutes: number;
  portions: number;
  descriptionMD: string;
  ingredients: Ingredient[]; // Interface { quantity, unit, name }
  stepsMD: string[];
  isPublic: boolean;
  createdAt: string | null; // ISO string vinda do JSON
  updatedAt: string | null;
}