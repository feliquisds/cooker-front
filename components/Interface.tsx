import { ReactNode, useState } from 'react';
import { ImageBackground, type ImageResizeMode, type ImageSourcePropType, ScrollView, View, type StyleProp, type ViewStyle, StyleSheet, RefreshControl, Platform } from 'react-native';
import { getGap, Section } from './Alignments';
import globalStyles from '../styles/Styles';
import { PlatformPressable } from '@react-navigation/elements';
import MaterialCommunityIcons from '@expo/vector-icons/build/MaterialCommunityIcons';
import { BlurView } from 'expo-blur';
import { useThemeMode } from './ThemeProvider';

type ScreenProps = {
    children?: ReactNode;
    style?: StyleProp<ViewStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    fill?: boolean;
    scrollPadding?: boolean;
    tabScreen?: boolean;
    onRefresh?: () => Promise<void>;
};

export function SimpleScreen({ children, style, containerStyle, fill, scrollPadding, tabScreen, onRefresh }: ScreenProps) {
    const [refreshing, setRefreshing] = useState(false);
    const { theme } = useThemeMode();
    const styles = globalStyles(theme);
    const scrollPaddingStyle = styles.scrollPadding;
    const tabScreenPaddingStyle = styles.tabScreenPadding;

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            if (onRefresh) {
                await onRefresh();
            }
        } finally {
            setRefreshing(false);
        }
    };

    return (
        <ScrollView
            style={[styles.screen, style]}
            contentContainerStyle={[
                getGap(15),
                containerStyle,
                fill ? { flexGrow: 1 } : {},
                scrollPadding ? scrollPaddingStyle : {},
                tabScreen ? tabScreenPaddingStyle : {}
            ]}
            scrollEnabled={true}
            refreshControl={
                Platform.OS !== 'web' && onRefresh ? (
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        progressViewOffset={0}
                    />
                ) : undefined
            }
        >
            {children}
        </ScrollView>
    );
}

type ImageScreenProps = ScreenProps & {
    source?: ImageSourcePropType;
    resizeMode?: ImageResizeMode;
};

export function ImageScreen({ children, style, containerStyle, fill, scrollPadding, tabScreen, source, resizeMode = 'cover', onRefresh }: ImageScreenProps) {
    const [refreshing, setRefreshing] = useState(false);
    const { theme } = useThemeMode();
    const styles = globalStyles(theme);
    const scrollPaddingStyle = styles.scrollPadding;
    const tabScreenPaddingStyle = styles.tabScreenPadding;

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            if (onRefresh) {
                await onRefresh();
            }
        } finally {
            setRefreshing(false);
        }
    };

    return (
        <ImageBackground source={source} resizeMode={resizeMode} style={[styles.staticArea, { width: '100%', height: '100%' }]}>
            <ScrollView
            style={[styles.scrollArea, style]}
                contentContainerStyle={[
                    getGap(15),
                    containerStyle,
                    fill ? { flexGrow: 1 } : {},
                    scrollPadding ? scrollPaddingStyle : {},
                    tabScreen ? tabScreenPaddingStyle : {}
                ]}
                scrollEnabled={true}
                refreshControl={
                    Platform.OS !== 'web' && onRefresh ? (
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            progressViewOffset={0}
                        />
                    ) : undefined
                }
            >
                {children}
            </ScrollView>
        </ImageBackground>
    );

}

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
    const { theme } = useThemeMode();
    return <View style={[globalStyles(theme).divider, style]} />;
}

type BackButtonProps = {
    navigation: { goBack: () => void };
};

export function BackButton({ navigation }: BackButtonProps) {
    const { theme } = useThemeMode();

    return (
        <PlatformPressable style={globalStyles(theme).backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name='chevron-left' style={globalStyles(theme).backButtonIcon} />
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