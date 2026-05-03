import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Subtext } from './Texts';
import { getGap, Section } from './Alignments';
import type { Gradient } from './Types';
import globalStyles from '../styles/Styles';
import globalColors from '../styles/Colors';
import { useThemeMode } from '../styles/ThemeProvider';

type CardProps = {
    children?: ReactNode;
    style?: StyleProp<ViewStyle>;
    subtitleStyle?: StyleProp<ViewStyle>;
    gap?: number;
    horizontal?: boolean;
    label?: string;
};

export function Card({ children, style, subtitleStyle, gap, horizontal, label }: CardProps) {
    const { theme } = useThemeMode();

    return (
        <Section gap={5}>
            {label && <Subtext style={[globalStyles(theme).textHorizontalMargins, subtitleStyle]}>{label}</Subtext>}
            <Section style={[globalStyles(theme).card, style]} gap={gap} horizontal={horizontal}>
                {children}
            </Section>
        </Section>
    );
}

type GradientCardProps = {
    children?: ReactNode;
    style?: StyleProp<ViewStyle>;
    gradient?: Gradient | null;
    gap?: number;
    start?: { x: number; y: number };
    end?: { x: number; y: number };
};

export function GradientCard({ children, style, gradient = null, gap, start, end }: GradientCardProps) {
    const { theme } = useThemeMode();
    const defaultGradient = globalColors(theme).accent;
    const resolvedGradient = gradient == null ? defaultGradient : gradient;

    return (
        <LinearGradient style={[globalStyles(theme).card, style, getGap(gap)]} colors={resolvedGradient} start={start} end={end}>
            {children}
        </LinearGradient>
    );
}

type CardElementProps = {
    children?: ReactNode;
    style?: StyleProp<ViewStyle>;
    gap?: number;
    horizontal?: boolean;
    spaceBetween?: boolean;
    centerVertical?: boolean;
};

export function CardElement({ children, style, gap, horizontal, spaceBetween, centerVertical }: CardElementProps) {
    const { theme } = useThemeMode();

    return (
        <Section
            style={[globalStyles(theme).card_element, style]}
            gap={gap}
            horizontal={horizontal}
            spaceBetween={spaceBetween}
            centerVertical={centerVertical}
        >
            {children}
        </Section>
    );
}