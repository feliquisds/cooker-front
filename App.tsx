import { useEffect } from 'react';
import { Platform } from 'react-native';
import Stack from './navigators/Stack';
import { ThemeProvider } from './components/ThemeProvider';
import { useThemeMode } from './components/ThemeProvider';
import globalColors from './styles/Colors';

function WebRootStyles() {
    const { theme } = useThemeMode();

    useEffect(() => {
        if (Platform.OS !== 'web') {
            return;
        }

        const body = document.body;
        const root = document.documentElement;
        const colors = globalColors(theme);
        const previousBodyOverflowY = body.style.overflowY;
        const previousBodyHeight = body.style.height;
        const previousBodyBackgroundColor = body.style.backgroundColor;
        const previousRootOverflowY = root.style.overflowY;
        const previousRootHeight = root.style.height;
        const previousRootBackgroundColor = root.style.backgroundColor;

        body.style.overflowY = 'auto';
        body.style.height = '100%';
        body.style.backgroundColor = colors.background;
        root.style.overflowY = 'auto';
        root.style.height = '100%';
        root.style.backgroundColor = colors.background;

        return () => {
            body.style.overflowY = previousBodyOverflowY;
            body.style.height = previousBodyHeight;
            body.style.backgroundColor = previousBodyBackgroundColor;
            root.style.overflowY = previousRootOverflowY;
            root.style.height = previousRootHeight;
            root.style.backgroundColor = previousRootBackgroundColor;
        };
    }, [theme]);

    return null;
}

export default function App() {
    return (
        <ThemeProvider>
            <WebRootStyles />
            <Stack />
        </ThemeProvider>
    );
}