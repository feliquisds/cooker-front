import type { Gradient } from '../components/Types';
import { resolveThemeMode, type ThemeSelection } from './Theme';

type ThemeColors = {
    background: string;
    text: string;
    foreground: string;
    divider: string;
    subtext: string;
    navigation: string;
    inactive: string;
    accent: Gradient;
    redHighlight: string;
    greenHighlight: string;
    orangeHighlight: string;
    yellowHighlight: string;
    buttonText: string;
    shadow: string;
};

const fixedColors: Pick<ThemeColors, 'accent' | 'redHighlight' | 'greenHighlight' | 'orangeHighlight' | 'yellowHighlight' | 'buttonText'> = {
    accent: ['#FF5E19', '#FFB074'],
    redHighlight: '#EF3E59',
    greenHighlight: '#4CAF50',
    orangeHighlight: '#FF9800',
    yellowHighlight: '#FFEB3B',
    buttonText: '#FFFFFF'
};

const lightColors: ThemeColors = {
    background: '#F3F3F5',
    text: '#1D1D1F',
    foreground: '#FFFFFF',
    divider: '#D3D3D5',
    subtext: '#6E6E73',
    navigation: '#FFFFFF66',
    inactive: '#C3C3CF',
    shadow: '#000',
    ...fixedColors
};

const darkColors: ThemeColors = {
    background: '#252525',
    text: '#DFDFE1',
    foreground: '#323232',
    divider: '#464649',
    subtext: '#949498',
    navigation: '#15151766',
    inactive: '#646468',
    shadow: '#000',
    ...fixedColors
};

export default function globalColors(force: ThemeSelection | '' = ''): ThemeColors {
    const theme = resolveThemeMode(force);

    return {
        background: theme === 'dark' ? darkColors.background : lightColors.background,
        text: theme === 'dark' ? darkColors.text : lightColors.text,
        foreground: theme === 'dark' ? darkColors.foreground : lightColors.foreground,
        divider: theme === 'dark' ? darkColors.divider : lightColors.divider,
        subtext: theme === 'dark' ? darkColors.subtext : lightColors.subtext,
        navigation: theme === 'dark' ? darkColors.navigation : lightColors.navigation,
        inactive: theme === 'dark' ? darkColors.inactive : lightColors.inactive,
        shadow: theme === 'dark' ? darkColors.shadow : lightColors.shadow,
        ...fixedColors
    };
}