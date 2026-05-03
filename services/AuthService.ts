import { AuthResponse } from '../model/dto/AuthResponse';
import { LoginRequest } from '../model/dto/LoginRequest';
import { RegisterRequest } from '../model/dto/RegisterRequest';
import APIAdapter from '../utils/APIAdapter';
import { clearAuthSession, getAuthToken, isAuthenticated as hasAuthSession, saveAuthSession } from './AuthSession';

export default class AuthService {
    #adapter: APIAdapter;

    constructor() {
        this.#adapter = new APIAdapter('auth');
    }

    // Register new user
    async register(registerRequest: RegisterRequest): Promise<AuthResponse> {
        const response = await this.#adapter.post<AuthResponse>('/register', registerRequest);
        await saveAuthSession(response);
        return response;
    }

    // Login user
    async login(loginRequest: LoginRequest): Promise<AuthResponse> {
        const response = await this.#adapter.post<AuthResponse>('/login', loginRequest);
        await saveAuthSession(response);
        return response;
    }

    // Logout
    async logout() {
        await clearAuthSession();
    }

    // Get stored token
    async getToken(): Promise<string | null> {
        return getAuthToken();
    }

    // Check if user is authenticated
    async isAuthenticated(): Promise<boolean> {
        return hasAuthSession();
    }
};