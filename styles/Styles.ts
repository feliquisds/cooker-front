import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import globalColors from './Colors';
import type { ThemeMode } from './Theme';

export type GlobalStyleVariables = {
    screenMargin: number;
    itemPadding: number;
    accentWeight: TextStyle['fontWeight'];
    title: number;
    header: number;
    text: number;
    subtext: number;
};

export const globalStyleVariables: GlobalStyleVariables = {
    screenMargin: 20,
    itemPadding: 17.5,
    accentWeight: '700',
    title: 30,
    header: 24,
    text: 16,
    subtext: 14
};

type GlobalStyleMap = {
    title: TextStyle;
    header: TextStyle;
    text: TextStyle;
    subtext: TextStyle;
    accentedText: TextStyle;
    textHorizontalMargins: ViewStyle;
    scrollArea: ViewStyle;
    staticArea: ViewStyle;
    screen: ViewStyle;
    input: TextStyle;
    roundInput: TextStyle;
    divider: ViewStyle;
    tabBar: ViewStyle;
    tabBarEntry: ViewStyle;
    card: ViewStyle;
    card_element: ViewStyle;
    smallButton: TextStyle;
    bigButton: ViewStyle;
    slimButton: ViewStyle;
    backButton: ViewStyle;
    backButtonIcon: TextStyle;
    toggle: ViewStyle;
    toggleButton: ViewStyle;
    scrollPadding: ViewStyle;
    tabScreenPadding: ViewStyle;
    space_between: ViewStyle;
    horizontal: ViewStyle;
    centerVertical: ViewStyle;
    alignRight: ViewStyle;
};

export default function globalStyles(force: ThemeMode | '' = ''): GlobalStyleMap {
    return StyleSheet.create({
        // text
        title: {
            color: globalColors(force).text,
            fontSize: globalStyleVariables.title,
            fontWeight: globalStyleVariables.accentWeight
        },
        header: {
            color: globalColors(force).text,
            fontSize: globalStyleVariables.header
        },
        text: {
            color: globalColors(force).text,
            fontSize: globalStyleVariables.text
        },
        subtext: {
            color: globalColors(force).subtext,
            fontSize: globalStyleVariables.subtext
        },
        accentedText: {
            fontWeight: globalStyleVariables.accentWeight
        },
        textHorizontalMargins: {
            marginHorizontal: globalStyleVariables.screenMargin
        },

        // interface
        scrollArea: {
            flex: 1,
            padding: globalStyleVariables.screenMargin
        },
        staticArea: {
            flex: 1,
            backgroundColor: globalColors(force).background
        },
        screen: {
            flex: 1,
            padding: globalStyleVariables.screenMargin,
            backgroundColor: globalColors(force).background
        },
        input: {
            color: globalColors(force).text,
            fontSize: globalStyleVariables.text
        },
        roundInput: {
            fontSize: globalStyleVariables.text,
            borderColor: globalColors(force).divider,
            borderWidth: 1,
            borderRadius: 30,
            height: 50,
            paddingHorizontal: 15
        },
        divider: {
            marginTop: 0,
            marginBottom: 0,
            marginHorizontal: globalStyleVariables.itemPadding,
            borderColor: globalColors(force).divider,
            borderBottomWidth: 1
        },

        // tab bar
        tabBar: {
            height: 66,
            bottom: globalStyleVariables.screenMargin,
            marginHorizontal: globalStyleVariables.screenMargin,
            left: 0,
            right: 0,
            position: 'absolute',
            borderRadius: 50,
            alignItems: 'center',
            backgroundColor: globalColors(force).navigation,
            gap: 3
        },
        tabBarEntry: {
            height: '100%',
            flex: 1,
            padding: 5,
            borderRadius: 50,
            backgroundColor: globalColors(force).navigation,
            alignItems: 'center',
            justifyContent: 'center'
        },

        // cards
        card: {
            padding: 0,
            borderRadius: 30,
            backgroundColor: globalColors(force).foreground,
            minHeight: 45
        },
        card_element: {
            padding: globalStyleVariables.itemPadding
        },

        // buttons
        smallButton: {
            color: globalColors(force).accent[0],
            alignSelf: 'flex-start',
            fontSize: globalStyleVariables.text,
            fontWeight: globalStyleVariables.accentWeight
        },
        bigButton: {
            backgroundColor: globalColors(force).buttonText,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            width: 180,
            height: 50,
            borderRadius: 30,
            paddingTop: 15,
            paddingBottom: 15,
            paddingLeft: 10,
            paddingRight: 10
        },
        slimButton: {
            backgroundColor: globalColors(force).buttonText,
            alignItems: 'center',
            justifyContent: 'center',
            height: 35,
            borderRadius: 30
        },
        backButton: {
            backgroundColor: globalColors(force).foreground,
            width: 40,
            height: 40,
            borderRadius: 100,
            padding: 10,
            paddingLeft: 14,
            paddingTop: 10
        },
        backButtonIcon: {
            color: globalColors(force).text,
            fontSize: 18
        },

        // toggles
        toggle: {
            minHeight: 0,
            padding: 2.5,
            width: 45,
            height: 23
        },
        toggleButton: {
            width: 18,
            height: 18,
            borderRadius: 100,
            backgroundColor: 'white'
        },

        // alignment
        scrollPadding: {
            paddingBottom: 40
        },
        tabScreenPadding: {
            paddingBottom: 126
        },
        space_between: {
            flex: 1,
            justifyContent: 'space-between',
        },
        horizontal: {
            flexDirection: 'row'
        },
        centerVertical: {
            alignItems: 'center'
        },
        alignRight: {
            alignItems: 'flex-end',
            alignSelf: 'flex-end'
        },
    }) as GlobalStyleMap;
}