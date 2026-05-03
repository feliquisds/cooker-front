import { AxiosInstance } from 'axios';
import APIService from './APIService';
import { Recipe } from '../model/Recipe';
import { Difficulty } from '../model/Difficulty';

export default class RecipeService {
    #api: AxiosInstance;
    #apiService: APIService;

    constructor() {
        this.#apiService = new APIService('recipes');
        this.#api = this.#apiService.getApi();
    }

    async getRecipeById(recipeId: string): Promise<Recipe> {
        try {
            const response = await this.#api.get(`/${recipeId}`);
            return response.data;
        } catch (error) {
            throw new Error('Erro ao buscar receita: ' + error);
        }
    }

    async createRecipe(recipeData: Partial<Recipe>, userId: string): Promise<Recipe> {
        try {
            const response = await this.#api.post(
                '/',
                recipeData,
                {
                    headers: { [this.#apiService.getUserHeader()]: userId } 
                });
            return response.data;
        } catch (error) {
            throw new Error('Erro ao criar receita: ' + error);
        }
    }

    async searchRecipes(title: string, tags: string[], difficulty: Difficulty, authorHandle: string): Promise<Recipe[]> {
        try {
            const response = await this.#api.get(
                '/search',
                {
                    params: { title, tags: tags.join(','), difficulty, authorHandle }
                });
            return response.data;
        } catch (error) {
            throw new Error('Erro ao buscar receitas: ' + error);
        }
    }
}