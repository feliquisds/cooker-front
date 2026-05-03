import { BookComponent } from "./BookComponent";

export interface Category {
  type: 'CATEGORY';
  name: string;
  items: BookComponent[]; // Aqui acontece a recursividade
}