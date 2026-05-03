import { Header, Subtext, Title, Text } from '../components/Texts';
import { SimpleScreen, Divider } from '../components/Interface';
import { Image, StyleSheet, useColorScheme } from 'react-native';
import { Card, CardElement } from '../components/Cards';
import { SmallSimpleButton } from '../components/Buttons';
import { Section } from '../components/Alignments';
import { AccentToggle } from '../components/Toggles';
import { useEffect, useState } from 'react';
import type { ScreenNavigation } from '../components/Types';

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

export default function Profile({ navigation }: ProfileProps) {
    const [nome, setNome] = useState('Carregando...');
    const colorScheme = useColorScheme();
    const [getCurrentTheme, setCurrentTheme] = useState<'dark' | 'light'>(colorScheme === 'dark' ? 'dark' : 'light');

    useEffect(() => {
        setCurrentTheme(colorScheme === 'dark' ? 'dark' : 'light');
    }, [colorScheme]);

    function changeTheme(isDarkMode: boolean) {
        if (isDarkMode) {
            setCurrentTheme('dark');
            console.log('modo escuro ativado');
        }
        else {
            setCurrentTheme('light');
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
                        <Header>{nome}</Header>
                        <Subtext>Responsável</Subtext>
                    </Section>
                </CardElement>
                <Divider />
                <CardElement>
                    <SmallSimpleButton onPress={() => navigation.navigate('EditProfile')}>Editar informações</SmallSimpleButton>
                </CardElement>
                <Divider />
                <CardElement>
                    <SmallSimpleButton>Solicitar documentos</SmallSimpleButton>
                </CardElement>
            </Card>

            <Card>
                <CardElement>
                    <SmallSimpleButton onPress={() => navigation.navigate('Accessibility')}>Acessibilidade</SmallSimpleButton>
                </CardElement>
                <Divider />
                <CardElement horizontal spaceBetween>
                    <Text accented>Modo escuro</Text>
                    <AccentToggle value={getCurrentTheme === 'dark'} onValueChange={changeTheme} />
                </CardElement>
                <Divider />
                <CardElement>
                    <SmallSimpleButton style={{ color: localColors.logout, textAlign: 'center' }} onPress={() => handleLogout(navigation)}>Sair</SmallSimpleButton>
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
        borderRadius: 69,
        borderWidth: 5,
        borderColor: '#FF5B8F',
    },
});

const localColors = {
    logout: '#FF002F'
};