import { ReactNode } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { PlatformPressable } from '@react-navigation/elements';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, GradientText } from './Texts';
import type { Gradient } from './Types';
import globalStyles from '../styles/Styles';
import globalColors from '../styles/Colors';
import { useThemeMode } from '../styles/ThemeProvider';

type ButtonProps = {
    children?: ReactNode;
    onPress?: () => void;
    gradient?: Gradient | null;
    style?: StyleProp<TextStyle> | StyleProp<ViewStyle>;
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

export function SmallSimpleButton({ children, onPress, style }: ButtonProps) {
    return (
        <PlatformPressable onPress={onPress}>
            <Text style={style}>{children}</Text>
        </PlatformPressable>
    );
}

export function SmallAccentButton({ children, onPress, style, gradient = null }: ButtonProps) {
    const { theme } = useThemeMode();
    const defaultGradient = globalColors(theme).accent;
    const resolvedGradient = gradient == null ? defaultGradient : gradient;

    return (
        <PlatformPressable onPress={onPress}>
            <GradientText accented style={style} gradient={resolvedGradient}>{children}</GradientText>
        </PlatformPressable>
    );
}
