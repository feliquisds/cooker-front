import { BookComponent } from "../model/BookComponent";
import { Category } from "../model/Category";
import { RecipeRef } from "../model/RecipeRef";
import { TextRef } from "../model/TextRef";

export const isCategory = (item: BookComponent): item is Category => {
  return item.type === 'CATEGORY';
};

export const isRecipeRef = (item: BookComponent): item is RecipeRef => {
  return item.type === 'RECIPE';
};

export const isTextRef = (item: BookComponent): item is TextRef => {
  return item.type === 'TEXT';
};