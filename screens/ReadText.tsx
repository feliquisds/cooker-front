import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Section } from '../components/Alignments';
import { SimpleScreen } from '../components/Interface';
import { Subtext, TitleWithBackButton, Text } from '../components/Texts';
import { ScreenNavigation } from '../components/Types';
import { useThemeMode } from '../components/ThemeProvider';
import globalColors from '../styles/Colors';

type ReadTextNavigation = ScreenNavigation<{}> & {
    goBack: () => void;
};

export default function ReadText({ navigation, textId }: { navigation: ReadTextNavigation; textId: string }) {
    const { theme } = useThemeMode();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const fetchText = async () => {
            if (mounted) {
                setLoading(false);
            }
        };

        void fetchText();

        return () => {
            mounted = false;
        };
    }, [textId]);

    return (
        <SimpleScreen>
            <TitleWithBackButton navigation={navigation}>Texto</TitleWithBackButton>

            {loading ? (
                <Section centerVertical style={{ minHeight: 240 }}>
                    <ActivityIndicator color={globalColors(theme).accent[0]} />
                    <Subtext style={{ marginTop: 10 }}>Carregando texto...</Subtext>
                </Section>
            ) : (
                <Section gap={15}>
                    <Text>Esta tela será implementada em breve para exibir o conteúdo completo do texto.</Text>
                    <Subtext>ID do texto: {textId}</Subtext>
                </Section>
            )}
        </SimpleScreen>
    );
}
