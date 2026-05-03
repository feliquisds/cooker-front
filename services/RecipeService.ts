import APIAdapter from '../utils/APIAdapter';
import { Recipe } from '../model/Recipe';
import { Difficulty } from '../model/Difficulty';

export default class RecipeService {
    #adapter: APIAdapter;

    constructor() {
        this.#adapter = new APIAdapter('recipes');
    }

    async getRecipeById(recipeId: string): Promise<Recipe> {
        return this.#adapter.get<Recipe>(`/${recipeId}`);
    }

    async createRecipe(recipeData: Partial<Recipe>): Promise<Recipe> {
        return this.#adapter.post<Recipe>('/', recipeData);
    }

    async searchRecipes(title: string, tags: string[], difficulty: Difficulty, authorHandle: string): Promise<Recipe[]> {
        return this.#adapter.get<Recipe[]>(
            '/search',
            { title, tags: tags.join(','), difficulty, authorHandle }
        );
    }
}