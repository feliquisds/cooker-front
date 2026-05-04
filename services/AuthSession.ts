import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthResponse } from '../model/dto/AuthResponse';

const authTokenKey = 'authToken';
const userIdKey = 'userId';
const userEmailKey = 'userEmail';

// In-memory cache to avoid repeated SecureStore calls (which can hang on Android)
let tokenCache: string | null = null;
let userIdCache: string | null = null;
let userEmailCache: string | null = null;

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

// Helper to wrap SecureStore operations with a timeout to prevent hanging
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 5000): Promise<T | null> {
    return Promise.race([
        promise,
        new Promise<null>(resolve => setTimeout(() => resolve(null), timeoutMs))
    ]);
}

async function setValue(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
        getWebStorage()?.setItem(key, value);
        return;
    }

    // Try SecureStore first on native
    if (secureStoreAvailable()) {
        try {
            await withTimeout(SecureStore.setItemAsync(key, value), 5000);
            // Update cache on successful write
            if (key === authTokenKey) tokenCache = value;
            else if (key === userIdKey) userIdCache = value;
            else if (key === userEmailKey) userEmailCache = value;
            console.log(`[AuthSession] Successfully set ${key} in SecureStore`);
            return;
        } catch (error) {
            console.warn(`[AuthSession] SecureStore failed, falling back to AsyncStorage:`, error);
        }
    }

    // Fallback to AsyncStorage on native if SecureStore unavailable
    try {
        await AsyncStorage.setItem(key, value);
        // Update cache on successful write
        if (key === authTokenKey) tokenCache = value;
        else if (key === userIdKey) userIdCache = value;
        else if (key === userEmailKey) userEmailCache = value;
        console.log(`[AuthSession] Successfully set ${key} in AsyncStorage`);
    } catch (error) {
        console.error(`[AuthSession] Failed to set ${key} in AsyncStorage:`, error);
    }
}

async function getValue(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
        return getWebStorage()?.getItem(key) ?? null;
    }

    // Return cached value if available (fast path)
    if (key === authTokenKey && tokenCache !== undefined) return tokenCache;
    if (key === userIdKey && userIdCache !== undefined) return userIdCache;
    if (key === userEmailKey && userEmailCache !== undefined) return userEmailCache;

    // Try SecureStore first on native
    if (secureStoreAvailable()) {
        try {
            const value = await withTimeout(SecureStore.getItemAsync(key), 5000);
            // Cache the result
            if (key === authTokenKey) tokenCache = value;
            else if (key === userIdKey) userIdCache = value;
            else if (key === userEmailKey) userEmailCache = value;
            return value;
        } catch (error) {
            console.warn(`[AuthSession] SecureStore read failed, trying AsyncStorage:`, error);
        }
    }

    // Fallback to AsyncStorage on native if SecureStore unavailable
    try {
        const value = await AsyncStorage.getItem(key);
        // Cache the result
        if (key === authTokenKey) tokenCache = value;
        else if (key === userIdKey) userIdCache = value;
        else if (key === userEmailKey) userEmailCache = value;
        return value;
    } catch (error) {
        console.error(`[AuthSession] Failed to get ${key} from AsyncStorage:`, error);
        return null;
    }
}

async function deleteValue(key: string): Promise<void> {
    if (Platform.OS === 'web') {
        getWebStorage()?.removeItem(key);
        // Clear cache
        if (key === authTokenKey) tokenCache = null;
        else if (key === userIdKey) userIdCache = null;
        else if (key === userEmailKey) userEmailCache = null;
        return;
    }

    // Try SecureStore first on native
    if (secureStoreAvailable()) {
        try {
            await withTimeout(SecureStore.deleteItemAsync(key), 5000);
            // Clear cache on successful delete
            if (key === authTokenKey) tokenCache = null;
            else if (key === userIdKey) userIdCache = null;
            else if (key === userEmailKey) userEmailCache = null;
            return;
        } catch (error) {
            console.warn(`[AuthSession] SecureStore delete failed, trying AsyncStorage:`, error);
        }
    }

    // Fallback to AsyncStorage on native if SecureStore unavailable
    try {
        await AsyncStorage.removeItem(key);
        // Clear cache on successful delete
        if (key === authTokenKey) tokenCache = null;
        else if (key === userIdKey) userIdCache = null;
        else if (key === userEmailKey) userEmailCache = null;
    } catch (error) {
        console.error(`[AuthSession] Failed to delete ${key} from AsyncStorage:`, error);
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
    try {
        const token = await getValue(authTokenKey);
        if (!token) {
            console.log('[AuthSession] No auth token found');
        }
        return token;
    } catch (error) {
        console.error('[AuthSession] Error getting auth token:', error);
        return null;
    }
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