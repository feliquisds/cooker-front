import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Title, Subtext, Text } from '../components/Texts';
import { SimpleScreen } from '../components/Interface';
import { Card, CardElement } from '../components/Cards';
import { Section } from '../components/Alignments';
import type { ScreenNavigation } from '../components/Types';

type HomeNavigation = ScreenNavigation<{
    QRCode: undefined;
    ViewStatement: undefined;
    AddCredit: undefined;
}>;

export default function Home({ navigation }: { navigation: HomeNavigation }) {
    return (
        <SimpleScreen tabScreen>
            <Title>Início</Title>

            <Card label="Recomendação do dia">
                <Section>
                    <CardElement gap={5}>
                        <Section horizontal spaceBetween centerVertical>
                            <Section>
                                <Text accented>Shoyu lamen</Text>
                                <Subtext>#tags #tags #tags</Subtext>
                            </Section>
                            <Image
                                source={{ uri: 'https://i.pravatar.cc/150?img=11' }}
                                style={styles.avatar}
                            />
                        </Section>

                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=600&auto=format&fit=crop' }}
                            style={styles.recipeImage}
                            />

                        <Subtext>Receitas da família</Subtext>
                    </CardElement>
                </Section>
            </Card>
        </SimpleScreen>
    );
}

const styles = StyleSheet.create({
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EEEEEE'
    },
    recipeImage: {
        width: '100%',
        height: 180,
        borderRadius: 12,
        marginTop: 12,
        backgroundColor: '#EEEEEE'
    }
});