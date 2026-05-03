import { Header, Subtext, Title, Text } from '../components/Texts';
import { SimpleScreen, Divider } from '../components/Interface';
import { Image, StyleSheet } from 'react-native';
import { Card, CardElement } from '../components/Cards';
import { SmallSimpleButton } from '../components/Buttons';
import { Section } from '../components/Alignments';
import { AccentToggle } from '../components/Toggles';
import { useEffect, useState } from 'react';
import type { ScreenNavigation } from '../components/Types';
import { useThemeMode } from '../styles/ThemeProvider';
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
    const [nome, setNome] = useState('Carregando...');
    const { theme, setTheme } = useThemeMode();

    function changeTheme(isDarkMode: boolean) {
        if (isDarkMode) {
            setTheme('dark');
            console.log('modo escuro ativado');
        }
        else {
            setTheme('light');
            console.log('modo escuro desativado');
        }
    }

    async function loadName() {
        try {
            setNome('test');
        } catch (error) {
            console.error('Erro ao carregar perfil: ', error);
        }
    }

    useEffect(() => {
        loadName();
    }, []);

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
                <CardElement>
                    <SmallSimpleButton onPress={() => navigation.navigate('EditProfile')}>Editar informações</SmallSimpleButton>
                </CardElement>
            </Card>

            <Card>
                <CardElement>
                    <SmallSimpleButton>Receitas favoritas <MaterialCommunityIcons color={globalColors(theme).redHighlight} name="heart" size={20} /></SmallSimpleButton>
                </CardElement>
                <Divider />
                <CardElement>
                    <SmallSimpleButton>Meus reviews</SmallSimpleButton>
                </CardElement>
                <Divider />
                <CardElement>
                    <SmallSimpleButton>Meus pedidos</SmallSimpleButton>
                </CardElement>
            </Card>
            <Card>
                <CardElement>
                    <SmallSimpleButton onPress={() => navigation.navigate('Accessibility')}>Acessibilidade</SmallSimpleButton>
                </CardElement>
                <Divider />
                <CardElement horizontal spaceBetween>
                    <Text accented>Modo escuro</Text>
                    <AccentToggle value={theme === 'dark'} onValueChange={changeTheme} />
                </CardElement>
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
        zIndex: 1,
        height: 90,
        width: 90,
        borderRadius: 69
    },
});