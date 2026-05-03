import { ReactNode } from 'react';
import { StyleProp, TextStyle, Text as ReactText } from 'react-native';
import { GradientText as ReactGradientText } from 'universal-gradient-text';
import { BackButton } from './Interface';
import { Section } from './Alignments';
import type { Gradient } from './Types';
import globalStyles from '../styles/Styles';
import globalColors from '../styles/Colors';

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
    return <ReactText style={[globalStyles().title, globalStyles().textHorizontalMargins, style]}>{children}</ReactText>;
}

type TitleWithBackButtonProps = TextProps & {
    navigation: { goBack: () => void };
};

export function TitleWithBackButton({ children, style, navigation }: TitleWithBackButtonProps) {
    return (
        <Section horizontal gap={10}>
            <BackButton navigation={navigation} />
            <ReactText style={[globalStyles().title, style]}>{children}</ReactText>
        </Section>
    );
}

export function Header({ children, style, accented, centerVertical, alignRight }: TextProps) {
    const accentedStyle = globalStyles().accentedText;

    return (
        <ReactText
            style={[
                globalStyles().header,
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
    const accentedStyle = globalStyles().accentedText;

    return (
        <ReactText
            style={[
                globalStyles().text,
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
    const accentedStyle = globalStyles().accentedText;

    return (
        <ReactText
            style={[
                globalStyles().subtext,
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
    const accentedStyle = globalStyles().accentedText;
    const defaultGradient = globalColors().accent;
    const resolvedGradient = gradient == null ? defaultGradient : gradient;

    return (
        <ReactGradientText
            style={[
                globalStyles().header,
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
    const accentedStyle = globalStyles().accentedText;
    const defaultGradient = globalColors().accent;
    const resolvedGradient = gradient == null ? defaultGradient : gradient;

    return (
        <ReactGradientText
            style={[
                globalStyles().text,
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
    const accentedStyle = globalStyles().accentedText;
    const defaultGradient = globalColors().accent;
    const resolvedGradient = gradient == null ? defaultGradient : gradient;

    return (
        <ReactGradientText
            style={[
                globalStyles().subtext,
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