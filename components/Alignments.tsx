import { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import globalStyles from '../styles/Styles';
import { useThemeMode } from './ThemeProvider';

export function getGap(gap?: number): ViewStyle {
    if (gap == 15) return { gap: 15 };
    if (gap == 10) return { gap: 10 };
    if (gap == 5) return { gap: 5 };
    return {};
}

type SectionProps = {
    children?: ReactNode;
    gap?: number;
    spaceBetween?: boolean;
    horizontal?: boolean;
    centerVertical?: boolean;
    alignRight?: boolean;
    style?: StyleProp<ViewStyle>;
};

export function Section({ children, gap, spaceBetween, horizontal, centerVertical, alignRight, style }: SectionProps) {
    const { theme } = useThemeMode();
    const styles = globalStyles(theme);
    const spaceBetweenStyle = styles.space_between;
    const horizontalStyle = styles.horizontal;
    const centerVerticalStyle = styles.centerVertical;
    const alignRightStyle = styles.alignRight;

    return (
        <View
            style={[
                getGap(gap),
                spaceBetween ? spaceBetweenStyle : {},
                horizontal ? horizontalStyle : {},
                centerVertical ? centerVerticalStyle : {},
                alignRight ? alignRightStyle : {},
                style
            ]}
        >
            {children}
        </View>
    );
}