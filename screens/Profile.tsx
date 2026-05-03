import { Header, Subtext, Title, Text } from '../components/Texts';
import { SimpleScreen, Divider } from '../components/Interface';
import { ActivityIndicator, Image, Linking, Platform, StyleSheet } from 'react-native';
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
import AuthService from '../services/AuthService';
import UserService from '../services/UserService';
import type { User } from '../model/User';

type ProfileNavigation = ScreenNavigation<{
    Login: undefined;
    EditProfile: undefined;
    Accessibility: undefined;
    Recovery: undefined;
    Favorited: undefined;
}>;

type ProfileProps = {
    navigation: ProfileNavigation;
};

type ChildProps = {
    navigation: ProfileNavigation;
    setLoggedIn: (loggedIn: boolean) => void;
};

const authService = new AuthService();
const userService = new UserService();

async function handleLogin(
    setloggedIn: (value: boolean) => void,
    activity: (value: boolean) => void,
    email: string,
    pass: string
): Promise<void> {
    if (!email || !pass) {
        return;
    }

    activity(true);

    try {
        await authService.login({ email, password: pass });
        setloggedIn(true);
    } finally {
        activity(false);
    }
}

async function handleLogout(setLoggedIn: (value: boolean) => void) {
    await authService.logout();
    setLoggedIn(false);
}

async function openSystemAccessibility(): Promise<void> {
    const isWindowsWeb = Platform.OS === 'web'
        && typeof navigator !== 'undefined'
        && /Windows/i.test(navigator.userAgent);

    try {
        if (Platform.OS === 'android' && typeof Linking.sendIntent === 'function') {
            await Linking.sendIntent('android.settings.ACCESSIBILITY_SETTINGS');
            return;
        }

        if ((Platform.OS as string) === 'windows' || isWindowsWeb) {
            const windowsSettingsUris = 'ms-settings:easeofaccess';
            await Linking.openURL(windowsSettingsUris);
            return;
        }

        if (Platform.OS === 'ios') {
            await Linking.openSettings();
            return;
        }
    } catch {
        // Fallback below
    }
}

function AccessibilityAndToggles({ children }: { children?: React.ReactNode }) {
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
            <SmallSimpleButton cardItem onPress={() => void openSystemAccessibility()}>Acessibilidade</SmallSimpleButton>
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

                <AccessibilityAndToggles />
            </Section>
        </SimpleScreen>
    );
}

function LoggedInScreen({navigation, setLoggedIn}: ChildProps) {
    const { theme } = useThemeMode();
    const [profile, setProfile] = useState<User | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);

    useEffect(() => {
        let mounted = true;

        void userService.getMyProfile()
            .then((user) => {
                if (mounted) {
                    setProfile(user);
                }
            })
            .catch(() => {
                if (mounted) {
                    setProfile(null);
                }
            })
            .finally(() => {
                if (mounted) {
                    setLoadingProfile(false);
                }
            });

        return () => {
            mounted = false;
        };
    }, []);

    const displayName = profile?.name ?? '';
    const displayHandle = profile?.handle ?? '';
    const displayBio = profile?.bio ?? 'Sem bio';
    const avatarSource = profile?.avatarUrl ? { uri: profile.avatarUrl } : undefined;

    return (
        <SimpleScreen tabScreen>
            <Title>Perfil</Title>

            <Card>
                <CardElement horizontal gap={15}>
                    <Image
                        source={avatarSource ?? require('../assets/default-avatar.png')}
                        style={localStyles.profilePicture}
                    />
                    <Section style={{ alignSelf: 'center' }}>
                        <Header>{displayName}</Header>
                        <Subtext>@{displayHandle}</Subtext>
                    </Section>
                </CardElement>
                <CardElement>
                    {loadingProfile ? (
                        <ActivityIndicator color={globalColors(theme).accent[0]} />
                    ) : (
                        <Subtext>{displayBio}</Subtext>
                    )}
                </CardElement>
                <Divider />
                <SmallSimpleButton cardItem onPress={() => navigation.navigate('EditProfile')}>Editar informações</SmallSimpleButton>
            </Card>

            <Card>
                <SmallSimpleButton cardItem onPress={() => navigation.navigate('Favorited')}>
                    Receitas favoritas <MaterialCommunityIcons color={globalColors(theme).redHighlight} name="heart" size={20} />
                </SmallSimpleButton>
                <Divider />
                <SmallSimpleButton cardItem>Meus reviews</SmallSimpleButton>
                <Divider />
                <SmallSimpleButton cardItem>Meus pedidos</SmallSimpleButton>
            </Card>

            <AccessibilityAndToggles>
                <>
                    <Divider />
                    <CardElement>
                        <SmallSimpleButton style={{ color: globalColors(theme).redHighlight, textAlign: 'center' }} onPress={() => handleLogout(setLoggedIn)}>
                            Sair <MaterialCommunityIcons name='logout' size={20} />
                        </SmallSimpleButton>
                    </CardElement>
                </>
            </AccessibilityAndToggles>
        </SimpleScreen>
    );
}

export default function Profile({ navigation }: ProfileProps) {
    const { theme } = useThemeMode();
    const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        let mounted = true;

        void authService.isAuthenticated().then((authenticated) => {
            if (mounted) {
                setLoggedIn(authenticated);
            }
        });

        return () => {
            mounted = false;
        };
    }, []);

    if (loggedIn === null) {
        return (
            <SimpleScreen fill>
                <Section style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <ActivityIndicator color={globalColors(theme).accent[0]} />
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