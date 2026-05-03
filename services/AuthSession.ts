import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import type { AuthResponse } from '../model/dto/AuthResponse';

const authTokenKey = 'authToken';
const userIdKey = 'userId';
const userEmailKey = 'userEmail';

function getWebStorage(): Storage | null {
    if (typeof window === 'undefined') {
        return null;
    }

    try {
        return window.localStorage;
    } catch {
        return null;
    }
}

function secureStoreAvailable(): boolean {
    return (
        typeof SecureStore.setItemAsync === 'function'
        && typeof SecureStore.getItemAsync === 'function'
        && typeof SecureStore.deleteItemAsync === 'function'
    );
}

async function setValue(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
        getWebStorage()?.setItem(key, value);
        return;
    }

    if (secureStoreAvailable()) {
        await SecureStore.setItemAsync(key, value);
    }
}

async function getValue(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
        return getWebStorage()?.getItem(key) ?? null;
    }

    if (secureStoreAvailable()) {
        return SecureStore.getItemAsync(key);
    }

    return null;
}

async function deleteValue(key: string): Promise<void> {
    if (Platform.OS === 'web') {
        getWebStorage()?.removeItem(key);
        return;
    }

    if (secureStoreAvailable()) {
        await SecureStore.deleteItemAsync(key);
    }
}

export async function saveAuthSession(response: AuthResponse): Promise<void> {
    await Promise.all([
        setValue(authTokenKey, response.token),
        setValue(userIdKey, response.userId),
        setValue(userEmailKey, response.email)
    ]);
}

export async function clearAuthSession(): Promise<void> {
    await Promise.all([
        deleteValue(authTokenKey),
        deleteValue(userIdKey),
        deleteValue(userEmailKey)
    ]);
}

export async function getAuthToken(): Promise<string | null> {
    return getValue(authTokenKey);
}

export async function getAuthenticatedUserId(): Promise<string | null> {
    return getValue(userIdKey);
}

export async function getAuthenticatedUserEmail(): Promise<string | null> {
    return getValue(userEmailKey);
}

export async function isAuthenticated(): Promise<boolean> {
    return !!(await getAuthToken());
}