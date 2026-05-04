import APIAdapter from '../utils/APIAdapter';
import { User } from '../model/User';
import { UserPublic } from '../model/dto/UserPublic';

export default class UserService {
    #adapter: APIAdapter;

    constructor() {
        this.#adapter = new APIAdapter('users');
    }

    async getMyProfile(): Promise<User> {
        return this.#adapter.get<User>('/me');
    }

    async getPublicProfileByHandle(userHandle: string): Promise<UserPublic> {
        return this.#adapter.get<UserPublic>(`/profile/${userHandle}`);
    }

    async getPublicProfileById(userId: string): Promise<UserPublic> {
        return this.#adapter.get<UserPublic>(`/profile/id/${userId}`);
    }

    async togglePrivacy(isPrivate: boolean): Promise<any> {
        return this.#adapter.patch<any>('/privacy', null, { isPrivate });
    }
}