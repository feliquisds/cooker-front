import { FlatList, type ListRenderItem } from 'react-native';
import { Divider, SimpleScreen } from '../components/Interface';
import { Header, Title, Text, Subtext } from '../components/Texts';
import { Card, CardElement, GradientCard } from '../components/Cards';
import { SlimSimpleButton, SmallAccentButton } from '../components/Buttons';
import { Section } from '../components/Alignments';
import globalColors from '../styles/Colors';
import type { ScreenNavigation } from '../components/Types';

type ReportItem = {
    id: string;
    title: string;
    date: string;
    score: string;
    subject: string;
};

const DATA: ReportItem[] = [
    { id: '1', title: 'Multiplicação', date: '10 de set.', score: '5,00', subject: 'Matemática' },
    { id: '2', title: 'História do Brasil', date: '9 de set.', score: '8,00', subject: 'História' },
    { id: '3', title: 'Verbos', date: '8 de set.', score: '9,00', subject: 'Português' },
];

type ReportsNavigation = ScreenNavigation<{
    AIReport: undefined;
}>;

type ReportsProps = {
    navigation: ReportsNavigation;
};

const renderNote: ListRenderItem<ReportItem> = ({ item }) => (
    <CardElement horizontal spaceBetween centerVertical>
        <Section>
            <Text>{item.title}</Text>
            <Subtext>{item.date}</Subtext>
        </Section>
        <Section alignRight>
            <Header>{item.score}</Header>
            <Subtext>{item.subject}</Subtext>
        </Section>
    </CardElement>
);

export default function Saved({ navigation }: ReportsProps) {
    return (
        <SimpleScreen tabScreen>
            <Title>Relatório</Title>

            <Card label={'Notas'}>
                <FlatList
                    data={DATA}
                    keyExtractor={(i) => i.id}
                    renderItem={renderNote}
                    ItemSeparatorComponent={() => <Divider />}
                />

                <Divider />

                <CardElement>
                    <SmallAccentButton>Verificar atividades recentes</SmallAccentButton>
                </CardElement>

                <Divider />

                <CardElement>
                    <SmallAccentButton>Verificar boletim</SmallAccentButton>
                </CardElement>
            </Card>
        </SimpleScreen>
    );
}