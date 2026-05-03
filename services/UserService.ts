import APIAdapter from '../utils/APIAdapter';
import { User } from '../model/User';
import { UserPublicDTO } from '../model/UserPublicDTO';

export default class UserService {
    #adapter: APIAdapter;

    constructor() {
        this.#adapter = new APIAdapter('users');
    }

    async getMyProfile(userId: string): Promise<User> {
        return this.#adapter.get<User>('/me', userId);
    }

    async getPublicProfile(userHandle: string, currentUserId: string): Promise<UserPublicDTO> {
        return this.#adapter.get<UserPublicDTO>(`/profile/${userHandle}`, currentUserId);
    }

    async togglePrivacy(userId: string, isPrivate: boolean): Promise<any> {
        return this.#adapter.patch<any>(
            '/privacy',
            null,
            userId,
            { isPrivate }
        );
    }
}