import { useColorScheme } from 'react-native';
import type { Gradient } from '../components/Types';

type ThemeColors = {
    background: string;
    text: string;
    foreground: string;
    divider: string;
    subtext: string;
    navigation: string;
    inactive: string;
    accent: Gradient;
    ai: Gradient;
    buttonText: string;
};

const fixedColors: Pick<ThemeColors, 'accent' | 'ai' | 'buttonText'> = {
    accent: ['#FF5B8F', '#FF9A4E'],
    ai: ['#4c8dff', '#0309C4'],
    buttonText: '#FFFFFF'
};

const lightColors: ThemeColors = {
    background: '#F2F2F7',
    text: '#000000',
    foreground: '#FFFFFF',
    divider: '#DFDFEC',
    subtext: '#75758A',
    navigation: '#FFFFFF66',
    inactive: '#ADADB5',
    ...fixedColors
};

const darkColors: ThemeColors = {
    background: '#000000',
    text: '#FFFFFF',
    foreground: '#1C1C1E',
    divider: '#363638',
    subtext: '#919199',
    navigation: '#1B1B1D66',
    inactive: '#777783',
    ...fixedColors
};

export default function globalColors(force = ''): ThemeColors {
    const theme = useColorScheme();

    if (force == 'light') return lightColors;
    if (force == 'dark') return darkColors;

    return {
        background: theme == 'dark' ? darkColors.background : lightColors.background,
        text: theme == 'dark' ? darkColors.text : lightColors.text,
        foreground: theme == 'dark' ? darkColors.foreground : lightColors.foreground,
        divider: theme == 'dark' ? darkColors.divider : lightColors.divider,
        subtext: theme == 'dark' ? darkColors.subtext : lightColors.subtext,
        navigation: theme == 'dark' ? darkColors.navigation : lightColors.navigation,
        inactive: theme == 'dark' ? darkColors.inactive : lightColors.inactive,
        ...fixedColors
    };
}