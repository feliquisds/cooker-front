import { useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { Section } from '../components/Alignments';
import { BigAccentButton } from '../components/Buttons';
import { Input } from '../components/Inputs';
import { SimpleScreen } from '../components/Interface';
import { Header, Subtext, TitleWithBackButton, Text } from '../components/Texts';
import { ScreenNavigation } from '../components/Types';
import { useThemeMode } from '../components/ThemeProvider';
import globalColors from '../styles/Colors';
import RecipeBookService from '../services/RecipeBookService';
import { RecipeBook } from '../model/RecipeBook';
import { getAuthenticatedUserId } from '../services/AuthSession';
import { PlatformPressable } from '@react-navigation/elements';

const recipeBookService = new RecipeBookService();

type AddRecipeBookNavigation = ScreenNavigation<{
    ReadRecipeBook: { bookId: string; title: string };
}> & {
    goBack: () => void;
};

function parseTags(value: string): string[] {
    return value
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
}

export default function AddRecipeBook({ navigation }: { navigation: AddRecipeBookNavigation }) {
    const { theme } = useThemeMode();
    const [title, setTitle] = useState('');
    const [descriptionMD, setDescriptionMD] = useState('');
    const [tagsText, setTagsText] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim()) {
            Alert.alert('Título necessário', 'Informe um título para o livro de receitas.');
            return;
        }

        setSaving(true);
        try {
            const authenticatedUserId = await getAuthenticatedUserId();
            const payload: RecipeBook = {
                id: '',
                ownerId: authenticatedUserId ?? '',
                title: title.trim(),
                descriptionMD,
                tags: parseTags(tagsText),
                isPublic,
                items: [],
                createdAt: null,
                updatedAt: null,
                rating: 0
            };

            const created = await recipeBookService.createRecipeBook(payload);
            (navigation as any).replace('ReadRecipeBook', { bookId: created.id, title: created.title });
        } catch (error) {
            console.error('Failed to create book', error);
            Alert.alert('Erro', 'Não foi possível criar o livro.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <SimpleScreen scrollPadding>
            <Section horizontal spaceBetween centerVertical style={{ marginBottom: 10 }}>
                <TitleWithBackButton navigation={navigation}>Novo livro</TitleWithBackButton>
            </Section>

            <Section gap={15}>
                <Section gap={10}>
                    <Header>Título</Header>
                    <Input
                        placeholder='Título do livro'
                        value={title}
                        onChangeText={setTitle}
                        multiline
                        autoGrow
                        minHeight={54}
                    />
                </Section>

                <Section gap={10}>
                    <Header>Descrição</Header>
                    <Input
                        placeholder='Breve descrição'
                        value={descriptionMD}
                        onChangeText={setDescriptionMD}
                        big
                        multiline
                        autoGrow
                        minHeight={110}
                    />
                </Section>

                <Section gap={10}>
                    <Header>Tags</Header>
                    <Input
                        placeholder='ex: sobremesa, regional, autoral'
                        value={tagsText}
                        onChangeText={setTagsText}
                        multiline
                        autoGrow
                        minHeight={54}
                    />
                </Section>

                <Section gap={10}>
                    <Header>Privacidade</Header>
                    <PlatformPressable
                        onPress={() => setIsPublic((current) => !current)}
                        style={{
                            paddingHorizontal: 16,
                            paddingVertical: 14,
                            borderRadius: 16,
                            borderWidth: 1,
                            borderColor: globalColors(theme).divider,
                            backgroundColor: globalColors(theme).foreground
                        }}
                    >
                        <Text>{isPublic ? 'Público' : 'Privado'}</Text>
                        <Subtext>{isPublic ? 'Qualquer pessoa pode encontrar este livro.' : 'Apenas você pode ver este livro.'}</Subtext>
                    </PlatformPressable>
                </Section>

                <Section>
                    {saving ? (
                        <ActivityIndicator color={globalColors(theme).accent[0]} />
                    ) : (
                        <BigAccentButton onPress={() => void handleSubmit()}>
                            Criar livro
                        </BigAccentButton>
                    )}
                </Section>
            </Section>
        </SimpleScreen>
    );
}
