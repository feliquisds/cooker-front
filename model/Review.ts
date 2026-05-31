import { Status } from "./Status";

export interface Review {
  id: string;
  targetId: string; // Pode ser ID de Receita ou Texto
  authorId: string;
  title: string;
  contentMD: string;
  images: string[];
  rating: number;   // Geralmente 1 a 5
  aiStatus: Status;
}