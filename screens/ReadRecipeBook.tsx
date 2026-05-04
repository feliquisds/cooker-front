import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Section } from '../components/Alignments';
import { SimpleScreen } from '../components/Interface';
import { Subtext, TitleWithBackButton, Text } from '../components/Texts';
import { ScreenNavigation } from '../components/Types';
import RecipeBookService from '../services/RecipeBookService';
import { RecipeBook } from '../model/RecipeBook';
import { useThemeMode } from '../components/ThemeProvider';
import globalColors from '../styles/Colors';

type ReadRecipeBookNavigation = ScreenNavigation<{}> & {
    goBack: () => void;
};

type ReadRecipeBookProps = {
    navigation: ReadRecipeBookNavigation;
    bookId: string;
    title?: string;
};

const recipeBookService = new RecipeBookService();

export default function ReadRecipeBook({ navigation, bookId, title }: ReadRecipeBookProps) {
    const { theme } = useThemeMode();
    const [book, setBook] = useState<RecipeBook | null>(null);

    useEffect(() => {
        let mounted = true;

        const fetchBook = async () => {
            const fetchedBook = await recipeBookService.getRecipeBookById(bookId);
            console.log(fetchedBook);
            if (mounted) {
                setBook(fetchedBook);
            }
        };

        void fetchBook();

        return () => {
            mounted = false;
        };
    }, [bookId]);

    const displayedTitle = book?.title ?? title ?? 'Livro de receitas';

    return (
        <SimpleScreen>
            <TitleWithBackButton navigation={navigation}>{displayedTitle}</TitleWithBackButton>

            {!book ? (
                <Section centerVertical style={{ minHeight: 240 }}>
                    <ActivityIndicator color={globalColors(theme).accent[0]} />
                    <Subtext style={{ marginTop: 10 }}>Carregando livro...</Subtext>
                </Section>
            ) : (
                <Section gap={15}>
                    <Text>Esta tela ainda será expandida para mostrar o conteúdo completo do livro.</Text>
                    <Subtext>ID do livro: {book.id}</Subtext>
                    <Subtext>Etiquetas: {book.tags.length > 0 ? book.tags.map(tag => `#${tag}`).join(' ') : 'Sem tags'}</Subtext>
                </Section>
            )}
        </SimpleScreen>
    );
}