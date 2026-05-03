import { Appearance, Platform } from 'react-native';

export type ThemeSelection = 'light' | 'dark' | 'system';
export type ThemeMode = 'light' | 'dark';

const storageKey = 'cooker.theme';

function readStoredSelection(): ThemeSelection | null {
    if (typeof window === 'undefined') return null;
    try {
        const stored = window.localStorage.getItem(storageKey);
        if (stored === 'light' || stored === 'dark' || stored === 'system') return stored as ThemeSelection;
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
    }
}

export function getThemeSelection(): ThemeSelection {
    return selectionOverride ?? 'system';
}