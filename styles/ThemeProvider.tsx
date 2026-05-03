import { createContext, useContext, useState, type ReactNode } from 'react';
import { getThemeMode, setThemeMode, type ThemeMode } from './Theme';

type ThemeContextValue = {
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = {
    children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setThemeState] = useState<ThemeMode>(getThemeMode());

    function setTheme(nextTheme: ThemeMode) {
        setThemeMode(nextTheme);
        setThemeState(nextTheme);
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
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