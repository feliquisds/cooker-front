import { Header, Subtext, Title, Text } from '../components/Texts';
import { SimpleScreen, Divider } from '../components/Interface';
import { Image, StyleSheet } from 'react-native';
import { Card, CardElement } from '../components/Cards';
import { SmallSimpleButton } from '../components/Buttons';
import { Section } from '../components/Alignments';
import { AccentToggle } from '../components/Toggles';
import type { ScreenNavigation } from '../components/Types';
import { useThemeMode } from '../components/ThemeProvider';
import globalColors from '../styles/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type ProfileNavigation = ScreenNavigation<{
    Login: undefined;
    EditProfile: undefined;
    Accessibility: undefined;
}>;

type ProfileProps = {
    navigation: ProfileNavigation;
};

function handleLogout(navigation: ProfileNavigation) {
    navigation.replace('Login');
}

const DATA = {
    id: '',
    handle: 'marimari12',
    name: 'Mariana',
    email: '',
    avatarUrl: null,
    bio: 'Apaixonada por um bolo de cenoura',
    birthDate: '1980-05-15',
    isPrivate: false,
    notificationTags: ['doce', 'bolo', 'cenoura'],
    favoriteRecipeIds: ['1', '2'],
    savedBookIds: ['1']
}

export default function Profile({ navigation }: ProfileProps) {
    const { theme, selection, setTheme } = useThemeMode();

    function changeTheme(isDarkMode: boolean) {
        setTheme(isDarkMode ? 'dark' : 'light');
    }

    function toggleSystemTheme(enabled: boolean) {
        if (enabled) setTheme('system');
        else setTheme(theme === 'dark' ? 'dark' : 'light');
    }

    return (
        <SimpleScreen tabScreen>
            <Title>Perfil</Title>

            <Card>
                <CardElement horizontal gap={15}>
                    <Image
                        // source={require('../assets/parentPfp.webp')}
                        style={localStyles.profilePicture}
                    />
                    <Section style={{ alignSelf: 'center' }}>
                        <Header>{DATA.name}</Header>
                        <Subtext>@{DATA.handle}</Subtext>
                    </Section>
                </CardElement>
                <CardElement>
                    <Subtext>{DATA.bio}</Subtext>
                </CardElement>
                <Divider />
                <SmallSimpleButton cardItem onPress={() => navigation.navigate('EditProfile')}>Editar informações</SmallSimpleButton>
            </Card>

            <Card>
                <SmallSimpleButton cardItem>Receitas favoritas <MaterialCommunityIcons color={globalColors(theme).redHighlight} name="heart" size={20} /></SmallSimpleButton>
                <Divider />
                <SmallSimpleButton cardItem>Meus reviews</SmallSimpleButton>
                <Divider />
                <SmallSimpleButton cardItem>Meus pedidos</SmallSimpleButton>
            </Card>
            <Card>
                <SmallSimpleButton cardItem onPress={() => navigation.navigate('Accessibility')}>Acessibilidade</SmallSimpleButton>
                <Divider />
                <CardElement horizontal spaceBetween>
                    <Text>Tema do sistema</Text>
                    <AccentToggle value={selection === 'system'} onValueChange={toggleSystemTheme} />
                </CardElement>
                {selection !== 'system' && (
                    <>
                        <Divider />
                        <CardElement horizontal spaceBetween>
                            <Text>Modo escuro</Text>
                            <AccentToggle value={selection === 'dark'} onValueChange={changeTheme} />
                        </CardElement>
                    </>
                )}
                <Divider />
                <CardElement>
                    <SmallSimpleButton style={{ color: globalColors(theme).redHighlight, textAlign: 'center' }} onPress={() => handleLogout(navigation)}>
                        Sair <MaterialCommunityIcons name='logout' size={20} />
                    </SmallSimpleButton>
                </CardElement>
            </Card>
        </SimpleScreen>
    );
}

const localStyles = StyleSheet.create({
    profilePicture: {
        height: 90,
        width: 90,
        borderRadius: 70
    },
});