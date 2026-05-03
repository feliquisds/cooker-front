import { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Title } from '../components/Texts';
import { Card, CardElement } from '../components/Cards';
import { BigSimpleButton, SmallSimpleButton } from '../components/Buttons';
import { Divider, SimpleScreen } from '../components/Interface';
import { Input } from '../components/Inputs';
import { Section } from '../components/Alignments';
import type { ScreenNavigation } from '../components/Types';
import { globalStyleVariables } from '../styles/Styles';
import globalColors from '../styles/Colors';

type LoginNavigation = ScreenNavigation<{
    Recovery: undefined;
    Tabs: undefined;
}>;

function timeout(delay: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, delay));
}

async function handleLogin(
    navigation: LoginNavigation,
    activity: (value: boolean) => void,
    email: string,
    pass: string
): Promise<void> {
    activity(true);
    await timeout(1000);

    navigation.replace('Tabs');
    activity(false);
}

export default function Login({ navigation }: { navigation: LoginNavigation }) {
    const [showActivityIndicator, changeShowActivityIndicator] = useState(false);
    const [getEmail, setEmail] = useState('');
    const [getPass, setPass] = useState('');

    const activityIndicator = <ActivityIndicator color={globalColors().accent[0]} style={{ backgroundColor: 'white' }} />;

    return (
        <SimpleScreen fill>
            <Section spaceBetween>
                <Section gap={15}>
                    <Title>Acesse sua conta</Title>

                    <Card>
                        <CardElement>
                            <Input
                                placeholder='Email'
                                value={getEmail}
                                onChangeText={(value) => setEmail(value)}
                                autoCapitalize='none'
                                keyboardType='email-address'
                            />
                        </CardElement>

                        <Divider />

                        <CardElement>
                            <Input
                                placeholder='Senha'
                                secureTextEntry={true}
                                value={getPass}
                                onChangeText={(value) => setPass(value)}
                            />
                        </CardElement>
                    </Card>

                    <SmallSimpleButton style={{ marginHorizontal: globalStyleVariables.screenMargin }} onPress={() => navigation.navigate('Recovery')}>
                        Esqueci a senha
                    </SmallSimpleButton>
                </Section>

                <BigSimpleButton onPress={() => handleLogin(navigation, changeShowActivityIndicator, getEmail, getPass)}>
                    {showActivityIndicator ? activityIndicator : 'Entrar'}
                </BigSimpleButton>
            </Section>
        </SimpleScreen>
    );
}