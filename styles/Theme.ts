import { Appearance, Platform } from 'react-native';

export type ThemeMode = 'light' | 'dark';

const storageKey = 'cooker.theme';

function readStoredTheme(): ThemeMode | null {
    if (typeof window === 'undefined') {
        return null;
    }

    const storedTheme = window.localStorage.getItem(storageKey);

    if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
    }

    return null;
}

let themeOverride: ThemeMode | null = readStoredTheme();

export function resolveThemeMode(force: ThemeMode | '' = ''): ThemeMode {
    if (force) {
        return force;
    }

    if (themeOverride) {
        return themeOverride;
    }

    return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
}

export function setThemeMode(theme: ThemeMode): void {
    themeOverride = theme;

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.localStorage.setItem(storageKey, theme);
    }
}

export function getThemeMode(): ThemeMode {
    return resolveThemeMode();
}