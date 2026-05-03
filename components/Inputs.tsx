import { Section } from './Alignments';
import { Subtext } from './Texts';
import globalColors from '../styles/Colors';
import globalStyles, { globalStyleVariables } from '../styles/Styles';
import { TextInput } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

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
    const defaultPlaceholderTextColor = globalColors().subtext;
    const resolvedPlaceholderTextColor = placeholderTextColor == null ? defaultPlaceholderTextColor : placeholderTextColor;

    return (
        <TextInput
            style={[globalStyles().input, big ? { fontSize: globalStyleVariables.header } : {}, style]}
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

type RoundInputProps = Omit<InputProps, 'big'> & {
    editable?: boolean;
    label?: string;
};

export function RoundInput({ style, placeholder, placeholderTextColor = null, value, onChangeText, secureTextEntry, editable = true, label }: RoundInputProps) {
    const defaultPlaceholderTextColor = globalColors().subtext;
    const activeTextColor = globalColors().text;
    const inactiveTextColor = globalColors().subtext;
    const resolvedPlaceholderTextColor = placeholderTextColor == null ? defaultPlaceholderTextColor : placeholderTextColor;

    return (
        <Section gap={5}>
            <Subtext>{label}</Subtext>
            <TextInput
                style={[globalStyles().roundInput, { color: editable ? activeTextColor : inactiveTextColor }, style]}
                placeholder={placeholder}
                placeholderTextColor={resolvedPlaceholderTextColor}
                secureTextEntry={secureTextEntry}
                value={value}
                onChangeText={onChangeText}
                editable={editable}
            />
        </Section>
    );
}