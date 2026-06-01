import { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { Section } from '../components/Alignments';
import { Title, Subtext } from '../components/Texts';
import { SimpleScreen } from '../components/Interface';
import { SearchBox } from '../components/Inputs';
import { ScreenNavigation } from '../components/Types';
import RecipeService from '../services/RecipeService';
import { Recipe } from '../model/Recipe';
import { useThemeMode } from '../components/ThemeProvider';
import globalColors from '../styles/Colors';
import { RecipeList } from '../components/RecipeList';

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

return (
        <SimpleScreen tabScreen>
            {/* Mantemos a sua estrutura original com o gap={15} aqui */}
            <Section gap={15}>
                <Title>Buscar</Title>
                <SearchBox
                    onChangeText={setQuery}
                    value={query} 
                />
            </Section>

            {/* Criamos uma nova Section separada só para os resultados, com uma margem no topo */}
            <Section gap={12} style={{ marginTop: 24, paddingBottom: 24 }}>
                {loading ? (
                    <Section centerVertical style={{ minHeight: 120 }}>
                        <ActivityIndicator color={globalColors(theme).accent[0]} size="large" />
                    </Section>
                ) : hasSearched && results.length === 0 ? (
                    <Section centerVertical style={{ minHeight: 120 }}>
                        <Subtext style={{ textAlign: 'center' }}>Nenhuma receita encontrada para "{debouncedQuery}"</Subtext>
                    </Section>
                ) : (
                    <RecipeList
                            data={results}
                            navigation={navigation}
                        />
                )}
            </Section>
        </SimpleScreen>
    );
}