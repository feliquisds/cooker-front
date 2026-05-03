import globalColors from '../styles/Colors';
import globalStyles from '../styles/Styles';
import { TextInput } from 'react-native';
import { useThemeMode } from './ThemeProvider';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { useState } from 'react';
import { BlurSurface } from './Interface';

type InputProps = {
    style?: StyleProp<ViewStyle>;
    placeholder?: string;
    placeholderTextColor?: string | null;
    value?: string;
    onChangeText?: (text: string) => void;
    secureTextEntry?: boolean;
    editable?: boolean;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad' | 'decimal-pad' | 'visible-password';
    big?: boolean;
};

export function Input({ style, placeholder, placeholderTextColor = null, value, onChangeText, secureTextEntry, editable, autoCapitalize, keyboardType, big }: InputProps) {
    const { theme } = useThemeMode();
    const defaultPlaceholderTextColor = globalColors(theme).subtext;
    const resolvedPlaceholderTextColor = placeholderTextColor == null ? defaultPlaceholderTextColor : placeholderTextColor;

    return (
        <TextInput
            style={[globalStyles(theme).input, big ? globalStyles(theme).header : {}, style]}
            placeholder={placeholder}
            placeholderTextColor={resolvedPlaceholderTextColor}
            secureTextEntry={secureTextEntry}
            value={value}
            onChangeText={onChangeText}
            editable={editable}
            autoCapitalize={autoCapitalize}
            keyboardType={keyboardType}
        />
    );
}

export function SearchBox({ style, placeholder, placeholderTextColor = null, value, onChangeText, editable }: InputProps) {
    const { theme } = useThemeMode();
    const themedColors = globalColors(theme);
    const [searchValue, setSearchValue] = useState('');

    const inputStyle: TextStyle = {
        textAlign: searchValue ? 'left' : 'center'
    };

    return (
        <BlurSurface
            intensity={35}
            style={[globalStyles(theme).shadow, { backgroundColor: themedColors.navigation, borderRadius: 30 }]}
        >
            <Input
                style={[inputStyle, style]}
                placeholder={placeholder || "Pesquisar"}
                placeholderTextColor={placeholderTextColor || themedColors.inactive}
                value={value}
                onChangeText={(value) => {
                    setSearchValue(value);
                    onChangeText && onChangeText(value);
                }}
                editable={editable}
                autoCapitalize='sentences'
                keyboardType='default'
            />
        </BlurSurface>
    );
}