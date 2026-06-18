import { ReactNode, useState } from 'react';
import { ImageBackground, type ImageResizeMode, type ImageSourcePropType, ScrollView, View, type StyleProp, type ViewStyle, StyleSheet, RefreshControl, Platform, KeyboardAvoidingView } from 'react-native';
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
    overlay?: ReactNode;
    overlayStyle?: StyleProp<ViewStyle>;
    fill?: boolean;
    scrollPadding?: boolean;
    tabScreen?: boolean;
    onRefresh?: () => Promise<void>;
};

export function SimpleScreen({ children, style, containerStyle, overlay, overlayStyle, fill, scrollPadding, tabScreen, onRefresh }: ScreenProps) {
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
        <KeyboardAvoidingView
            style={[styles.screen, { position: 'relative' }, style]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
        >
            <ScrollView
                style={{ flex: 1, minHeight: 0 }}
                contentContainerStyle={[
                    getGap(15),
                    containerStyle,
                    fill ? { flexGrow: 1 } : {},
                    scrollPadding ? scrollPaddingStyle : {},
                    tabScreen ? tabScreenPaddingStyle : {}
                ]}
                scrollEnabled={true}
                keyboardShouldPersistTaps='handled'
                keyboardDismissMode='on-drag'
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

            {overlay ? (
                <View pointerEvents='box-none' style={[{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }, overlayStyle]}>
                    {overlay}
                </View>
            ) : null}
        </KeyboardAvoidingView>
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
        <KeyboardAvoidingView
            style={[styles.staticArea, { width: '100%', height: '100%' }, style]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
        >
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
                    keyboardShouldPersistTaps='handled'
                    keyboardDismissMode='on-drag'
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
        </KeyboardAvoidingView>
    );

}

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
    const { theme } = useThemeMode();
    return <View style={[globalStyles(theme).divider, style]} />;
}

type BackButtonProps = {
    navigation: {
        goBack: () => void;
        canGoBack?: () => boolean;
        navigate?: (screen: string, params?: any) => void;
    };
};

export function BackButton({ navigation }: BackButtonProps) {
    const { theme } = useThemeMode();

    const handlePress = () => {
        if (navigation.canGoBack?.()) {
            navigation.goBack();
            return;
        }

        navigation.navigate?.('Tabs');
    };

    return (
        <PlatformPressable style={globalStyles(theme).backButton} onPress={handlePress}>
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