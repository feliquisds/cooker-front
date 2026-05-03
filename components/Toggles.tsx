import { useEffect, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { PlatformPressable } from '@react-navigation/elements';
import { Section } from './Alignments';
import { GradientCard } from './Cards';
import type { Gradient } from './Types';
import globalStyles from '../styles/Styles';
import globalColors from '../styles/Colors';
import { useThemeMode } from '../styles/ThemeProvider';

type AccentToggleProps = {
    value: boolean;
    onValueChange: (value: boolean) => void;
    disabled?: boolean;
};

export function AccentToggle(props: AccentToggleProps) {
    const { value, onValueChange, disabled } = props;
    const { theme } = useThemeMode();
    const [animatedValue] = useState(new Animated.Value(value ? 1 : 0));
    const inactive = globalColors(theme).inactive;
    const accent = globalColors(theme).accent;
    const currentBg: Gradient = value ? accent : [inactive, inactive] as Gradient;

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 22.5],
    });

    const toggleSwitch = () => {
        const newValue = !value;
        onValueChange(newValue);
    };

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: value ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
            easing: Easing.ease
        }).start();
    }, [value, animatedValue]);

    return (
        <PlatformPressable onPress={toggleSwitch} disabled={disabled}>
            <GradientCard gradient={currentBg} style={globalStyles(theme).toggle}>
                <Animated.View style={{ transform: [{ translateX }] }}>
                    <Section style={globalStyles(theme).toggleButton} />
                </Animated.View>
            </GradientCard>
        </PlatformPressable>
    );
}