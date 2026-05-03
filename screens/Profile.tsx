import { Header, Subtext, Title, Text } from '../components/Texts';
import { SimpleScreen, Divider } from '../components/Interface';
import { ActivityIndicator, Image, StyleSheet } from 'react-native';
import { Card, CardElement } from '../components/Cards';
import { BigAccentButton, SmallAccentButton, SmallSimpleButton } from '../components/Buttons';
import { Section } from '../components/Alignments';
import { AccentToggle } from '../components/Toggles';
import type { ScreenNavigation } from '../components/Types';
import { useThemeMode } from '../components/ThemeProvider';
import globalColors from '../styles/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Input } from '../components/Inputs';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

type ProfileNavigation = ScreenNavigation<{
    Login: undefined;
    EditProfile: undefined;
    Accessibility: undefined;
    Recovery: undefined;
}>;

type ProfileProps = {
    navigation: ProfileNavigation;
};

type ChildProps = {
    navigation: ProfileNavigation;
    setLoggedIn: (loggedIn: boolean) => void;
};

function timeout(delay: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, delay));
}

async function handleLogin(
    setloggedIn: (value: boolean) => void,
    activity: (value: boolean) => void,
    email: string,
    pass: string
): Promise<void> {
    activity(true);
    await timeout(1000);

    AsyncStorage.setItem('loggedIn', 'true');
    setloggedIn(true);
    activity(false);
}

function handleLogout(setLoggedIn: (value: boolean) => void) {
    AsyncStorage.removeItem('loggedIn');
    setLoggedIn(false);
}

function AccessibilityAndToggles({children}: {children?: React.ReactNode}) {
    const { theme, selection, setTheme } = useThemeMode();

    function changeTheme(isDarkMode: boolean) {
        setTheme(isDarkMode ? 'dark' : 'light');
    }

    function toggleSystemTheme(enabled: boolean) {
        if (enabled) setTheme('system');
        else setTheme(theme === 'dark' ? 'dark' : 'light');
    }

    return (
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
            {children}
        </Card>
    )
}

function LoggedOutScreen({ navigation, setLoggedIn }: ChildProps) {
    const { theme } = useThemeMode();
    const [showActivityIndicator, changeShowActivityIndicator] = useState(false);
    const [getEmail, setEmail] = useState('');
    const [getPass, setPass] = useState('');

    const activityIndicator = <ActivityIndicator color={globalColors(theme).buttonText} />;

    return (
        <SimpleScreen tabScreen>
            <Section gap={15}>
                <Title>Acesse sua conta</Title>
                <Text>Com uma conta, você pode salvar e compartilhar suas receitas favoritas!</Text>
                <Card>
                    <Input
                        placeholder='Email'
                        value={getEmail}
                        onChangeText={(value) => setEmail(value)}
                        autoCapitalize='none'
                        keyboardType='email-address'
                    />

                    <Divider />

                    <Input
                        placeholder='Senha'
                        secureTextEntry={true}
                        value={getPass}
                        onChangeText={(value) => setPass(value)}
                    />
                </Card>

                <SmallAccentButton onPress={() => navigation.navigate('Recovery')}>
                    Esqueceu a senha?
                </SmallAccentButton>

                <BigAccentButton onPress={() => handleLogin(setLoggedIn, changeShowActivityIndicator, getEmail, getPass)}>
                    {showActivityIndicator ? activityIndicator : 'Entrar'}
                </BigAccentButton>

                <Section centerVertical>
                    <Text>Não tem uma conta?</Text>
                    <SmallAccentButton>Crie uma nova conta</SmallAccentButton>
                </Section>

                {AccessibilityAndToggles({children: undefined})}
            </Section>
        </SimpleScreen>
    );
}

function LoggedInScreen({navigation, setLoggedIn}: ChildProps) {
    const { theme } = useThemeMode();

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

            {AccessibilityAndToggles({
                children: (
                    <>
                        <Divider />
                        <CardElement>
                            <SmallSimpleButton style={{ color: globalColors(theme).redHighlight, textAlign: 'center' }} onPress={() => handleLogout(setLoggedIn)}>
                                Sair <MaterialCommunityIcons name='logout' size={20} />
                            </SmallSimpleButton>
                        </CardElement>
                    </>
                )
            })}
        </SimpleScreen>
    );
}

export default function Profile({ navigation }: ProfileProps) {
    const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        AsyncStorage.getItem('loggedIn').then(value => {
            setLoggedIn(value === 'true');
        });
    }, []);

    if (loggedIn === null) {
        return (
            <SimpleScreen fill>
                <Section style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <ActivityIndicator />
                </Section>
            </SimpleScreen>
        );
    }

    if (loggedIn) {
        return <LoggedInScreen navigation={navigation} setLoggedIn={setLoggedIn} />;
    }

    return <LoggedOutScreen navigation={navigation} setLoggedIn={setLoggedIn}/>;
}

const localStyles = StyleSheet.create({
    profilePicture: {
        height: 90,
        width: 90,
        borderRadius: 70
    },
});