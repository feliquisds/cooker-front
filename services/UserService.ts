import { AxiosInstance } from 'axios';
import APIService from "./APIService";
import { User } from '../model/User';
import { UserPublicDTO } from '../model/UserPublicDTO';

export default class UserService {
    #api: AxiosInstance;
    #apiService: APIService;

    constructor() {
        this.#apiService = new APIService('users');
        this.#api = this.#apiService.getApi();
    }

    async getMyProfile(userId: string): Promise<User> {
        try {
            const response = await this.#api.get(
                `/me`,
                {
                    headers: { [this.#apiService.getUserHeader()]: userId }
                });
            return response.data;
        } catch (error) {
            throw new Error('Erro ao buscar perfil do usuário: ' + error);
        }
    }

    async getPublicProfile(userHandle: string, currentUserId: string): Promise<UserPublicDTO> {
        try {
            const response = await this.#api.get(
                `/profile/${userHandle}`,
                {
                    headers: { [this.#apiService.getUserHeader()]: currentUserId }
                }
            );
            return response.data;
        } catch (error) {
            throw new Error('Erro ao buscar perfil público do usuário: ' + error);
        }
    }

    async togglePrivacy(userId: string, isPrivate: boolean): Promise<any> {
        try {
            const response = await this.#api.patch(
                `/privacy`,
                null,
                {
                    headers: { [this.#apiService.getUserHeader()]: userId },
                    params: { isPrivate }
                }
            );
            return response.data;
        } catch (error) {
            throw new Error('Erro ao alterar privacidade do perfil: ' + error);
        }
    }
}