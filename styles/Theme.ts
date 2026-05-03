import { Appearance, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeSelection = 'light' | 'dark' | 'system';
export type ThemeMode = 'light' | 'dark';

const storageKey = 'cooker.theme';

function toThemeSelection(value: string | null): ThemeSelection | null {
    if (value === 'light' || value === 'dark' || value === 'system') {
        return value;
    }
    return null;
}

function readStoredSelection(): ThemeSelection | null {
    if (typeof window === 'undefined') return null;
    try {
        return toThemeSelection(window.localStorage.getItem(storageKey));
    } catch {
        // Ignore localStorage errors
    }
    return null;
}

let selectionOverride: ThemeSelection | null = readStoredSelection();

// Resolve a selection (possibly 'system') to an effective ThemeMode ('light'|'dark')
export function resolveThemeMode(selection: ThemeSelection | '' = ''): ThemeMode {
    if (selection === 'light' || selection === 'dark') return selection;
    if (selection === 'system') return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';

    if (selectionOverride === 'light' || selectionOverride === 'dark') return selectionOverride;
    if (selectionOverride === 'system') return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';

    return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
}

export function setThemeSelection(selection: ThemeSelection): void {
    selectionOverride = selection;

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.localStorage.setItem(storageKey, selection);
        return;
    }

    void AsyncStorage.setItem(storageKey, selection).catch(() => {
        // Ignore AsyncStorage errors to avoid crashing the UI flow
    });
}

export function getThemeSelection(): ThemeSelection {
    return selectionOverride ?? 'system';
}

export async function hydrateThemeSelection(): Promise<ThemeSelection> {
    if (Platform.OS === 'web') {
        const selection = readStoredSelection() ?? selectionOverride ?? 'system';
        selectionOverride = selection;
        return selection;
    }

    try {
        const stored = await AsyncStorage.getItem(storageKey);
        const selection = toThemeSelection(stored) ?? selectionOverride ?? 'system';
        selectionOverride = selection;
        return selection;
    } catch {
        const fallback = selectionOverride ?? 'system';
        selectionOverride = fallback;
        return fallback;
    }
}