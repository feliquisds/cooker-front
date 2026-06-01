import { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, Image, type ImageStyle, type ListRenderItem } from 'react-native';
import { Section } from '../components/Alignments';
import { Title, Subtext } from '../components/Texts';
import { SearchBox } from '../components/Inputs';
import { ScreenNavigation } from '../components/Types';
import RecipeService from '../services/RecipeService';
import { Recipe } from '../model/Recipe';
import { useThemeMode } from '../components/ThemeProvider';
import globalColors from '../styles/Colors';
import globalStyles from '../styles/Styles';
import { PlatformPressable } from '@react-navigation/elements';
import { Card, CardElement } from '../components/Cards';
import { Text } from '../components/Texts';
import { DifficultyChip, PortionChip, TimeChip } from '../components/Chip';

type SearchNavigation = ScreenNavigation<{
    ReadRecipe: { recipeId: string; title: string };
}>;

const recipeService = new RecipeService();

function parseSearchQuery(input: string) {
    const tags = Array.from(
        new Set(
            [...input.matchAll(/#([\p{L}\p{N}_-]+)/gu)].map((match) => match[1])
        )
    );

    const title = input
        .replace(/#([\p{L}\p{N}_-]+)/gu, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    return { title, tags };
}

export default function Search({ navigation }: { navigation: SearchNavigation }) {
    const { theme } = useThemeMode();
    const styles = globalStyles(theme);
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [results, setResults] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // Efeito de Debounce: Atualiza a debouncedQuery 500ms após o usuário parar de digitar
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    // Efeito de Busca: Disparado apenas quando a debouncedQuery muda
    useEffect(() => {
        const fetchSearchResults = async () => {
            const { title, tags } = parseSearchQuery(debouncedQuery);

            if (!title && tags.length === 0) {
                setResults([]);
                setHasSearched(false);
                return;
            }

            try {
                setLoading(true);
                setHasSearched(true);

                // A busca usa o texto restante como título e extrai hashtags para o parâmetro de tags.
                const data = await recipeService.searchRecipes(title, tags, undefined as any, '');
                setResults(data);
            } catch (error) {
                console.error('Erro ao buscar receitas:', error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        void fetchSearchResults();
    }, [debouncedQuery]);

    const renderRecipe: ListRenderItem<Recipe> = ({ item }) => (
        <PlatformPressable onPress={() => navigation.navigate('ReadRecipe', { recipeId: item.id, title: item.title })}>
            <Card>
                <CardElement gap={10}>
                    <Section>
                        <Text>{item.title}</Text>
                    </Section>
                    <Section gap={5}>
                        <Section horizontal gap={10}>
                            <DifficultyChip difficulty={item.difficulty} />
                            <TimeChip time={item.timeMinutes} />
                            <PortionChip portions={item.portions} />
                        </Section>
                        <Subtext>{item.tags.map(tag => `#${tag}`).join(' ')}</Subtext>
                    </Section>
                    {item.images != null && item.images.length > 0 && <Image source={{ uri: item.images[0] }} style={imageStyle} />}
                </CardElement>
            </Card>
        </PlatformPressable>
    );

    return (
        <FlatList
            style={styles.screen}
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={renderRecipe}
            ListHeaderComponent={
                <Section gap={15} style={{ marginBottom: 24 }}>
                    <Title>Buscar</Title>
                    <SearchBox
                        onChangeText={setQuery}
                        value={query}
                    />
                </Section>
            }
            ListEmptyComponent={
                loading ? (
                    <Section centerVertical style={{ minHeight: 120 }}>
                        <ActivityIndicator color={globalColors(theme).accent[0]} size="large" />
                    </Section>
                ) : hasSearched ? (
                    <Section centerVertical style={{ minHeight: 120 }}>
                        <Subtext style={{ textAlign: 'center' }}>Nenhuma receita encontrada para "{debouncedQuery}"</Subtext>
                    </Section>
                ) : null
            }
            contentContainerStyle={[{ gap: 15 }, styles.tabScreenPadding, { paddingBottom: 24 }]}
        />
    );
}

const imageStyle: ImageStyle = {
    width: '100%',
    height: 100,
    borderRadius: 15,
};