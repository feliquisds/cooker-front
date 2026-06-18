import { ReactNode } from 'react';
import { StyleProp, TextStyle, Text as ReactText } from 'react-native';
import { GradientText as ReactGradientText } from 'universal-gradient-text';
import { BackButton } from './Interface';
import { Section } from './Alignments';
import type { Gradient } from './Types';
import globalStyles from '../styles/Styles';
import globalColors from '../styles/Colors';
import { useThemeMode } from './ThemeProvider';

type TextProps = {
    children?: ReactNode;
    style?: StyleProp<TextStyle>;
    accented?: boolean;
    centerVertical?: boolean;
    alignRight?: boolean;
};

type GradientTextProps = TextProps & {
    gradient?: Gradient | null;
};

export function Title({ children, style }: TextProps) {
    const { theme } = useThemeMode();
    return <ReactText style={[globalStyles(theme).title, globalStyles(theme).textHorizontalMargins, style]}>{children}</ReactText>;
}

type TitleWithBackButtonProps = TextProps & {
    navigation: {
        goBack: () => void;
        canGoBack?: () => boolean;
        navigate?: (screen: string, params?: any) => void;
    };
};

export function TitleWithBackButton({ children, style, navigation }: TitleWithBackButtonProps) {
    const { theme } = useThemeMode();

    return (
        <Section horizontal gap={10} style={{ flex: 1, minWidth: 0, alignItems: 'center' }}>
            <BackButton navigation={navigation} />
            <ReactText style={[globalStyles(theme).title, { flex: 1, flexShrink: 1, flexWrap: 'wrap' }, style]}>{children}</ReactText>
        </Section>
    );
}

export function Header({ children, style, accented, centerVertical, alignRight }: TextProps) {
    const { theme } = useThemeMode();
    const accentedStyle = globalStyles(theme).accentedText;

    return (
        <ReactText
            style={[
                globalStyles(theme).header,
                style,
                accented ? accentedStyle : {},
                centerVertical ? { textAlignVertical: 'center' } : {},
                alignRight ? { textAlign: 'right' } : {}
            ]}
        >
            {children}
        </ReactText>
    );
}

export function Text({ children, style, accented, centerVertical, alignRight }: TextProps) {
    const { theme } = useThemeMode();
    const accentedStyle = globalStyles(theme).accentedText;

    return (
        <ReactText
            style={[
                globalStyles(theme).text,
                style,
                accented ? accentedStyle : {},
                centerVertical ? { textAlignVertical: 'center' } : {},
                alignRight ? { textAlign: 'right' } : {}
            ]}
        >
            {children}
        </ReactText>
    );
}

export function Subtext({ children, style, accented, centerVertical, alignRight }: TextProps) {
    const { theme } = useThemeMode();
    const accentedStyle = globalStyles(theme).accentedText;

    return (
        <ReactText
            style={[
                globalStyles(theme).subtext,
                style,
                accented ? accentedStyle : {},
                centerVertical ? { textAlignVertical: 'center' } : {},
                alignRight ? { textAlign: 'right' } : {}
            ]}
        >
            {children}
        </ReactText>
    );
}

export function GradientHeader({ children, gradient = null, style, accented, centerVertical, alignRight }: GradientTextProps) {
    const { theme } = useThemeMode();
    const accentedStyle = globalStyles(theme).accentedText;
    const defaultGradient = globalColors(theme).accent;
    const resolvedGradient = gradient == null ? defaultGradient : gradient;

    return (
        <ReactGradientText
            style={[
                globalStyles(theme).header,
                style,
                accented ? accentedStyle : {},
                centerVertical ? { textAlignVertical: 'center' } : {},
                alignRight ? { textAlign: 'right' } : {}
            ]}
            colors={[...resolvedGradient]}
        >
            {children}
        </ReactGradientText>
    );
}

export function GradientText({ children, gradient = null, style, accented, centerVertical, alignRight }: GradientTextProps) {
    const { theme } = useThemeMode();
    const accentedStyle = globalStyles(theme).accentedText;
    const defaultGradient = globalColors(theme).accent;
    const resolvedGradient = gradient == null ? defaultGradient : gradient;

    return (
        <ReactGradientText
            style={[
                globalStyles(theme).text,
                style,
                accented ? accentedStyle : {},
                centerVertical ? { textAlignVertical: 'center' } : {},
                alignRight ? { textAlign: 'right' } : {}
            ]}
            colors={[...resolvedGradient]}
        >
            {children}
        </ReactGradientText>
    );
}

export function GradientSubtext({ children, gradient = null, style, accented, centerVertical, alignRight }: GradientTextProps) {
    const { theme } = useThemeMode();
    const accentedStyle = globalStyles(theme).accentedText;
    const defaultGradient = globalColors(theme).accent;
    const resolvedGradient = gradient == null ? defaultGradient : gradient;

    return (
        <ReactGradientText
            style={[
                globalStyles(theme).subtext,
                style,
                accented ? accentedStyle : {},
                centerVertical ? { textAlignVertical: 'center' } : {},
                alignRight ? { textAlign: 'right' } : {}
            ]}
            colors={[...resolvedGradient]}
        >
            {children}
        </ReactGradientText>
    );
}