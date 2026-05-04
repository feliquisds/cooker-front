import { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Divider, SimpleScreen } from '../components/Interface';
import { Input } from '../components/Inputs';
import { Header, TitleWithBackButton, Text } from '../components/Texts';
import { Card, CardElement } from '../components/Cards';
import { Section } from '../components/Alignments';
import { BigAccentButton } from '../components/Buttons';
import type { ScreenNavigation } from '../components/Types';

type RecoveryNavigation = ScreenNavigation<{}> & {
    goBack: () => void;
};

function timeout(delay: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, delay));
}

async function processRecovery(navigation: RecoveryNavigation, activity: (value: boolean) => void, email: string): Promise<void> {
    activity(true);
    await timeout(1000);

    navigation.goBack();
    activity(false);
}

export default function Recovery({ navigation }: { navigation: RecoveryNavigation }) {
    const [showActivityIndicator, changeShowActivityIndicator] = useState(false);
    const [getEmail, setEmail] = useState('');

    return (
        <SimpleScreen fill>
            <TitleWithBackButton navigation={navigation}>Recuperar acesso</TitleWithBackButton>

            <Section spaceBetween>
                <Card>
                    <Section>
                        <CardElement gap={10}>
                            <Header>Digite seu email</Header>
                            <Text>Caso seu email conste em nosso banco de dados, enviaremos um link para cadastro de uma nova senha</Text>
                        </CardElement>

                        <Divider />
                    </Section>

                    <Input
                        placeholder='Email'
                        value={getEmail}
                        onChangeText={(value) => setEmail(value)}
                    />
                </Card>

                <BigAccentButton onPress={() => processRecovery(navigation, changeShowActivityIndicator, getEmail)}>
                    {showActivityIndicator ? <ActivityIndicator color={'#FFF'} /> : 'Confirmar'}
                </BigAccentButton>
            </Section>
        </SimpleScreen>
    );
}