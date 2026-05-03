import { useState } from "react";
import globalColors from "../styles/Colors";
import { Input } from "./Inputs";
import { useThemeMode } from "../styles/ThemeProvider";
import type { TextStyle } from 'react-native';
import globalStyles from "../styles/Styles";
import { BlurSurface } from "./Interface";


export function SearchBox() {
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
                style={inputStyle}
                placeholder="Pesquisar"
                placeholderTextColor={themedColors.inactive}
                value={searchValue}
                onChangeText={setSearchValue}
            />
        </BlurSurface>
    );
}