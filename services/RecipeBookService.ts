import APIAdapter from '../utils/APIAdapter';
import { RecipeBook } from '../model/RecipeBook';

export default class RecipeBookService {
    #adapter: APIAdapter;

    constructor() {
        this.#adapter = new APIAdapter('books');
    }

    async getRecipeBooks(userId: string): Promise<RecipeBook[]> {
        return this.#adapter.get<RecipeBook[]>('/', userId);
    }

    async getRecipeBookById(bookId: string, userId: string): Promise<RecipeBook> {
        return this.#adapter.get<RecipeBook>(`/${bookId}`, userId);
    }

    async createRecipeBook(bookData: Partial<RecipeBook>, userId: string): Promise<RecipeBook> {
        return this.#adapter.post<RecipeBook>('/', bookData, userId);
    }
}
