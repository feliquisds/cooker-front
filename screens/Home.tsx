import { useState, useEffect } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { SlimSimpleButton, SmallAccentButton } from '../components/Buttons';
import { Card, CardElement, GradientCard } from '../components/Cards';
import { Section } from '../components/Alignments';
import { Header, Subtext, Text, Title } from '../components/Texts';
import { Divider, SimpleScreen } from '../components/Interface';
import type { ScreenNavigation } from '../components/Types';

type EventItem = {
    id: string;
    titulo: string;
    dataInicio: string;
    categoria: string;
};

type Wallet = {
    saldo: number | null;
};

const DATA: EventItem[] = [
    { id: '1', titulo: 'Excursão', dataInicio: 'Em 3 dias', categoria: 'Escola' },
    { id: '2', titulo: 'Reunião de pais', dataInicio: 'Em 5 dias', categoria: 'Escola' },
    { id: '3', titulo: 'Prova', dataInicio: 'Em 7 dias', categoria: 'Matemática' }
];

type HomeNavigation = ScreenNavigation<{
    QRCode: undefined;
    ViewStatement: undefined;
    AddCredit: undefined;
}>;

type HomeProps = {
    navigation: HomeNavigation;
};

export default function Home({ navigation }: HomeProps) {
    const [eventos, setEventos] = useState<EventItem[]>([]);
    const [carteira, setCarteira] = useState<Wallet | null>({ saldo: null });

    async function fetchCarteira() {
        try {
            setCarteira(null);
        } catch (error) {
            console.error('Falha ao carregar a carteira: ', error);
        }
    }

    async function fetchEventos() {
        try {
            setEventos(DATA);
        } catch (error) {
            console.error('Erro ao carregar eventos:', error);
        }
    }

    useEffect(() => {
        fetchEventos();
        fetchCarteira();
    }, []);

    return (
        <SimpleScreen tabScreen>
            <Title>Resumo</Title>
            <GradientCard gap={15}>
                <CardElement gap={15}>
                    <Section horizontal gap={10} centerVertical>
                        <Header centerVertical style={{ color: '#FFF' }}>Hoje tem aula!</Header>
                    </Section>

                    <SlimSimpleButton onPress={() => navigation.navigate('QRCode')}>Liberar aluno</SlimSimpleButton>
                </CardElement>
            </GradientCard>

            <Card label={'Eventos'}>
                <FlatList
                    data={eventos}
                    keyExtractor={(i) => i.id}
                    renderItem={({ item }) => (
                        <CardElement horizontal spaceBetween centerVertical>
                            <Section>
                                <Text>{item.titulo}</Text>
                            </Section>
                            <Section alignRight>
                                <Text accented>{item.dataInicio}</Text>
                                <Subtext>{item.categoria}</Subtext>
                            </Section>
                        </CardElement>
                    )}
                    ItemSeparatorComponent={() => <Divider />}
                />

                <Divider />

                <CardElement>
                    <SmallAccentButton>Verificar agenda completa</SmallAccentButton>
                </CardElement>
            </Card>

            {
                carteira != null &&
                <Card label={'Crédito da pulseira'}>
                    <CardElement>
                        <Text>Crédito disponível</Text>
                        <Text accented>R$ {Number(carteira.saldo || 0).toFixed(2)}</Text>
                    </CardElement>

                    <Divider />

                    <CardElement>
                        <SmallAccentButton onPress={() => navigation.navigate('ViewStatement')}>Visualizar extrato</SmallAccentButton>
                    </CardElement>

                    <Divider />

                    <CardElement>
                        <SmallAccentButton onPress={() => navigation.navigate('AddCredit')}>Adicionar crédito</SmallAccentButton>
                    </CardElement>
                </Card>
            }
        </SimpleScreen>
    );
}

const localStyles = StyleSheet.create({
    pfp: {
        height: 70,
        width: 70,
        resizeMode: 'contain'
    }
});