import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Appearance } from 'react-native';
import {
    resolveThemeMode,
    getThemeSelection,
    setThemeSelection,
    hydrateThemeSelection,
    type ThemeSelection,
    type ThemeMode
} from '../styles/Theme';

type ThemeContextValue = {
    // resolved applied theme ('light' | 'dark')
    theme: ThemeMode;
    // the user's selection: 'light' | 'dark' | 'system'
    selection: ThemeSelection;
    // set selection (accepts 'system' too)
    setTheme: (selection: ThemeSelection) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = {
    children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [selection, setSelectionState] = useState<ThemeSelection>(getThemeSelection());
    const [tick, setTick] = useState(0); // used to trigger re-resolve on Appearance change

    useEffect(() => {
        let mounted = true;

        void hydrateThemeSelection().then((storedSelection) => {
            if (mounted) {
                setSelectionState(storedSelection);
            }
        });

        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        const sub = Appearance.addChangeListener(() => {
            // only update when following system
            if (selection === 'system') setTick((t) => t + 1);
        });

        return () => sub.remove();
    }, [selection]);

    const theme = resolveThemeMode(selection);

    function setTheme(nextSelection: ThemeSelection) {
        setThemeSelection(nextSelection);
        setSelectionState(nextSelection);
    }

    return (
        <ThemeContext.Provider value={{ theme, selection, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeMode() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useThemeMode must be used within ThemeProvider');
    }

    return context;
}