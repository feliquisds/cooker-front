import APIAdapter from '../utils/APIAdapter';
import { RecipeBook } from '../model/RecipeBook';

export default class RecipeBookService {
    #adapter: APIAdapter;

    constructor() {
        this.#adapter = new APIAdapter('books');
    }

    async getRecipeBooks(): Promise<RecipeBook[]> {
        return this.#adapter.get<RecipeBook[]>('/');
    }

    async getRecipeBookById(bookId: string): Promise<RecipeBook> {
        return this.#adapter.get<RecipeBook>(`/${bookId}`);
    }

    async createRecipeBook(bookData: Partial<RecipeBook>): Promise<RecipeBook> {
        return this.#adapter.post<RecipeBook>('/', bookData);
    }

    async searchRecipeBooks(title: string, tags: string[], authorHandle: string): Promise<RecipeBook[]> {
        return this.#adapter.get<RecipeBook[]>(
            '/search',
            { title, tags: tags.join(','), authorHandle }
        );
    }

    async getSavedRecipeBooks(): Promise<RecipeBook[]> {
        return this.#adapter.get<RecipeBook[]>('/saved');
    }
}
