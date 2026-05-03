import { ReactNode } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { PlatformPressable } from '@react-navigation/elements';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, GradientText } from './Texts';
import type { Gradient } from './Types';
import globalStyles from '../styles/Styles';
import globalColors from '../styles/Colors';
import { useThemeMode } from './ThemeProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type ButtonProps = {
    children?: ReactNode;
    onPress?: () => void;
    gradient?: Gradient | null;
    style?: StyleProp<TextStyle> | StyleProp<ViewStyle>;
    cardItem?: boolean;
};

export function BigSimpleButton({ children, onPress, gradient = null }: ButtonProps) {
    const { theme } = useThemeMode();
    const defaultGradient = globalColors(theme).accent;
    const resolvedGradient = gradient == null ? defaultGradient : gradient;

    return (
        <PlatformPressable style={globalStyles(theme).bigButton} onPress={onPress}>
            <GradientText accented gradient={resolvedGradient}>{children}</GradientText>
        </PlatformPressable>
    );
}

export function BigAccentButton({ children, onPress, gradient = null }: ButtonProps) {
    const { theme } = useThemeMode();
    const defaultGradient = globalColors(theme).accent;
    const resolvedGradient = gradient == null ? defaultGradient : gradient;

    return (
        <PlatformPressable onPress={onPress}>
            <LinearGradient style={globalStyles(theme).bigButton} colors={resolvedGradient}>
                <Text accented style={{ color: globalColors(theme).buttonText }}>{children}</Text>
            </LinearGradient>
        </PlatformPressable>
    );
}

export function SlimSimpleButton({ children, onPress, gradient = null }: ButtonProps) {
    const { theme } = useThemeMode();
    const defaultGradient = globalColors(theme).accent;
    const resolvedGradient = gradient == null ? defaultGradient : gradient;

    return (
        <PlatformPressable style={globalStyles(theme).slimButton} onPress={onPress}>
            <GradientText accented gradient={resolvedGradient}>{children}</GradientText>
        </PlatformPressable>
    );
}

export function SlimAccentButton({ children, onPress, gradient = null }: ButtonProps) {
    const { theme } = useThemeMode();
    const defaultGradient = globalColors(theme).accent;
    const resolvedGradient = gradient == null ? defaultGradient : gradient;

    return (
        <PlatformPressable onPress={onPress}>
            <LinearGradient style={globalStyles(theme).slimButton} colors={resolvedGradient}>
                <Text accented style={{ color: globalColors(theme).buttonText }}>{children}</Text>
            </LinearGradient>
        </PlatformPressable>
    );
}

export function SmallSimpleButton({ children, onPress, style, cardItem }: ButtonProps) {
    const { theme } = useThemeMode();
    const arrow = <MaterialCommunityIcons name='chevron-right' style={[globalStyles(theme).header, { color: globalColors(theme).subtext }]} />;

    return (
        <PlatformPressable onPress={onPress} style={cardItem ? [globalStyles(theme).card_element, { flexDirection: 'row', justifyContent: 'space-between' }] : {}}>
            <Text style={style}>{children}</Text>
            {cardItem && arrow}
        </PlatformPressable>
    );
}

export function SmallAccentButton({ children, onPress, style, gradient = null, cardItem }: ButtonProps) {
    const { theme } = useThemeMode();
    const defaultGradient = globalColors(theme).accent;
    const resolvedGradient = gradient == null ? defaultGradient : gradient;
    const arrow = <MaterialCommunityIcons name='chevron-right' style={[globalStyles(theme).header, { color: globalColors(theme).accent[0] }]} />;

    return (
        <PlatformPressable onPress={onPress} style={cardItem ? [globalStyles(theme).card_element, { flexDirection: 'row', justifyContent: 'space-between' }] : {}}>
            <GradientText accented style={style} gradient={resolvedGradient}>{children}</GradientText>
            {cardItem && arrow}
        </PlatformPressable>
    );
}
