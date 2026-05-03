import { ReactNode } from 'react';
import { ImageBackground, type ImageResizeMode, type ImageSourcePropType, ScrollView, View, type StyleProp, type ViewStyle, StyleSheet } from 'react-native';
import { getGap, Section } from './Alignments';
import globalStyles from '../styles/Styles';
import { PlatformPressable } from '@react-navigation/elements';
import MaterialCommunityIcons from '@expo/vector-icons/build/MaterialCommunityIcons';
import { BlurView } from 'expo-blur';
import { useThemeMode } from '../styles/ThemeProvider';
import globalColors from '../styles/Colors';

type ScreenProps = {
    children?: ReactNode;
    style?: StyleProp<ViewStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    fill?: boolean;
    scrollPadding?: boolean;
    tabScreen?: boolean;
};

export function SimpleScreen({ children, style, containerStyle, fill, scrollPadding, tabScreen }: ScreenProps) {
    const scrollPaddingStyle = globalStyles().scrollPadding;
    const tabScreenPaddingStyle = globalStyles().tabScreenPadding;

    return (
        <ScrollView
            style={[globalStyles().screen, style]}
            contentContainerStyle={[
                getGap(15),
                containerStyle,
                fill ? { height: '100%' } : {},
                scrollPadding ? scrollPaddingStyle : {},
                tabScreen ? tabScreenPaddingStyle : {}
            ]}
        >
            {children}
        </ScrollView>
    );
}

type ImageScreenProps = ScreenProps & {
    source?: ImageSourcePropType;
    resizeMode?: ImageResizeMode;
};

export function ImageScreen({ children, style, containerStyle, fill, scrollPadding, tabScreen, source, resizeMode = 'cover' }: ImageScreenProps) {
    const scrollPaddingStyle = globalStyles().scrollPadding;
    const tabScreenPaddingStyle = globalStyles().tabScreenPadding;

    return (
        <ImageBackground source={source} resizeMode={resizeMode} style={[globalStyles().staticArea, { width: '100%', height: '100%' }]}>
            <ScrollView
                style={[globalStyles().scrollArea, style]}
                contentContainerStyle={[
                    getGap(15),
                    containerStyle,
                    fill ? { height: '100%' } : {},
                    scrollPadding ? scrollPaddingStyle : {},
                    tabScreen ? tabScreenPaddingStyle : {}
                ]}
            >
                {children}
            </ScrollView>
        </ImageBackground>
    );
}

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
    return <View style={[globalStyles().divider, style]} />;
}

type BackButtonProps = {
    navigation: { goBack: () => void };
};

export function BackButton({ navigation }: BackButtonProps) {
    return (
        <PlatformPressable style={globalStyles().backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name='arrow-left' style={globalStyles().backButtonIcon} />
        </PlatformPressable>
    );
}

type BlurSurfaceProps = {
    children?: ReactNode;
    style?: StyleProp<ViewStyle>;
    intensity?: number;
};

export function BlurSurface({ children, style, intensity = 35 }: BlurSurfaceProps) {
    const { theme } = useThemeMode();

    return (
        <Section style={[styles.blurContainer, style]}>
            <BlurView intensity={intensity} tint={theme === 'dark' ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
            <Section>{children}</Section>
        </Section>
    );
}

const styles = StyleSheet.create({
    blurContainer: {
        overflow: 'hidden'
    }
});