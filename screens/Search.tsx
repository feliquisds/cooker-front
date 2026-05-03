import { FlatList, type ListRenderItem } from 'react-native';
import { Section } from '../components/Alignments';
import { Card, GradientCard, CardElement } from '../components/Cards';
import { Text, Subtext, Title } from '../components/Texts';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SimpleScreen } from '../components/Interface';
import type { Gradient } from '../components/Types';
import globalColors from '../styles/Colors';

type NotificationItem = {
    id: number;
    title: string;
    subtitle: string;
    author: string;
    type: 'info' | 'warning' | 'danger';
};

const DATA: NotificationItem[] = [
    {
        id: 1,
        title: 'Atividades extraclasse',
        subtitle: 'Vivências culturais',
        author: 'Professora Gisele',
        type: 'info',
    },
    {
        id: 2,
        title: 'Regularização dos uniformes',
        subtitle: '',
        author: 'Administração acadêmica',
        type: 'warning',
    },
    {
        id: 3,
        title: 'Ciclos de atividades não entregues',
        subtitle: 'Matemática',
        author: 'Professora Márcia',
        type: 'info',
    },
    {
        id: 4,
        title: 'Conversas paralelas',
        subtitle: 'Geografia',
        author: 'Professora Suelen',
        type: 'danger',
    },
];

type BadgeProps = {
    type: NotificationItem['type'];
};

function Badge({ type }: BadgeProps) {
    return (
        <Section
            centerVertical
            style={{
                width: 54,
                height: 54,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {type === 'info' ? <MaterialCommunityIcons name='information-outline' size={48} color='#5B5B5B' />
                : type === 'warning' ? <MaterialCommunityIcons name='newspaper' size={40} color='#6a3e00' />
                    : type === 'danger' ? <MaterialCommunityIcons name='alert' size={48} color='#710000ff' />
                        : null}
        </Section>
    );
}

type AvisoCardProps = {
    item: NotificationItem;
};

function AvisoCard({ item }: AvisoCardProps) {
    const gradient: Gradient | null =
        item.type === 'warning'
            ? [globalColors().foreground, '#FFB300']
            : item.type === 'danger'
                ? [globalColors().foreground, '#E53935']
                : null;

    if (gradient) {
        return (
            <GradientCard gradient={gradient} start={{ x: 0.6, y: 1 }} end={{ x: 1, y: 0.5 }}>
                <CardElement>
                    <Section horizontal centerVertical spaceBetween>
                        <Section style={{ flex: 1 }} gap={5}>
                            <Text accented>{item.title}</Text>
                            <Section>
                                {item.subtitle && <Subtext style={{ color: globalColors().text }}>{item.subtitle}</Subtext>}
                                <Subtext>{item.author}</Subtext>
                            </Section>
                        </Section>
                        <Badge type={item.type} />
                    </Section>
                </CardElement>
            </GradientCard>
        );
    }

    return (
        <Card>
            <CardElement>
                <Section horizontal centerVertical spaceBetween>
                    <Section style={{ flex: 1 }} gap={5}>
                        <Text accented>{item.title}</Text>
                        <Section>
                            {item.subtitle && <Subtext style={{ color: globalColors().text }}>{item.subtitle}</Subtext>}
                            <Subtext>{item.author}</Subtext>
                        </Section>
                    </Section>
                    <Badge type={item.type} />
                </Section>
            </CardElement>
        </Card>
    );
}

const renderItem: ListRenderItem<NotificationItem> = ({ item }) => <AvisoCard item={item} />;

export default function Notifications() {
    return (
        <SimpleScreen tabScreen>
            <Section gap={15}>
                <Title>Avisos</Title>

                <FlatList
                    data={DATA}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderItem}
                    contentContainerStyle={{ gap: 15, height: '100%' }}
                />
            </Section>
        </SimpleScreen>
    );
}