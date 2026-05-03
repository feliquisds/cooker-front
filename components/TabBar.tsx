import { useLinkBuilder } from '@react-navigation/native';
import { PlatformPressable } from '@react-navigation/elements';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GradientSubtext } from './Texts';
import { Section } from './Alignments';
import globalStyles from '../styles/Styles';
import globalColors from '../styles/Colors';
import { useThemeMode } from '../styles/ThemeProvider';
import { BlurSurface } from './Interface';

function getTabBarIcon(route: string, focused: boolean) {
    let icon: keyof typeof MaterialCommunityIcons.glyphMap | undefined;

    switch (route) {
        case 'Home':
            icon = focused ? 'home' : 'home-outline';
            break;
        case 'Saved':
            icon = focused ? 'bookmark' : 'bookmark-outline';
            break;
        case 'Search':
            icon = 'magnify';
            break;
        case 'Profile':
            icon = focused ? 'account' : 'account-outline';
            break;
        default:
            icon = 'circle-outline';
    }

    return icon;
}

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const { buildHref } = useLinkBuilder();
    const { theme } = useThemeMode();
    const themedColors = globalColors(theme);

    return (
        <BlurSurface
            intensity={40}
            style={[globalStyles(theme).tabBar, globalStyles(theme).shadow]}
        >
            <Section horizontal style={globalStyles(theme).tabBarContent}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;
                    const accent = themedColors.accent;
                    const inactive = themedColors.inactive;
                    const foreground = themedColors.foreground;

                    const label = options.title !== undefined
                        ? options.title
                        : route.name;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    return (
                        <PlatformPressable
                            key={route.name}
                            href={buildHref(route.name, route.params)}
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            onPress={onPress}
                            style={[globalStyles(theme).tabBarEntry, isFocused ? { backgroundColor: foreground } : {}]}
                        >
                            <GradientSubtext gradient={isFocused ? accent : [inactive, inactive]}>
                                <MaterialCommunityIcons name={getTabBarIcon(route.name, isFocused)} size={20} />
                            </GradientSubtext>
                            <GradientSubtext accented={isFocused} gradient={isFocused ? accent : [inactive, inactive]}>
                                {label}
                            </GradientSubtext>
                        </PlatformPressable>
                    );
                })}
            </Section>
        </BlurSurface>
    );
}