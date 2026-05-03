import * as SecureStore from 'expo-secure-store';
import type { AuthResponse } from '../model/dto/AuthResponse';

const authTokenKey = 'authToken';
const userIdKey = 'userId';
const userEmailKey = 'userEmail';

export async function saveAuthSession(response: AuthResponse): Promise<void> {
    await Promise.all([
        SecureStore.setItemAsync(authTokenKey, response.token),
        SecureStore.setItemAsync(userIdKey, response.userId),
        SecureStore.setItemAsync(userEmailKey, response.email)
    ]);
}

export async function clearAuthSession(): Promise<void> {
    await Promise.all([
        SecureStore.deleteItemAsync(authTokenKey),
        SecureStore.deleteItemAsync(userIdKey),
        SecureStore.deleteItemAsync(userEmailKey)
    ]);
}

export async function getAuthToken(): Promise<string | null> {
    return SecureStore.getItemAsync(authTokenKey);
}

export async function getAuthenticatedUserId(): Promise<string | null> {
    return SecureStore.getItemAsync(userIdKey);
}

export async function getAuthenticatedUserEmail(): Promise<string | null> {
    return SecureStore.getItemAsync(userEmailKey);
}

export async function isAuthenticated(): Promise<boolean> {
    return !!(await getAuthToken());
}