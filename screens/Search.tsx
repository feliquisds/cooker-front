import { useState, useEffect } from 'react';
import { ActivityIndicator, Image, ImageStyle, View } from 'react-native';
import { PlatformPressable } from '@react-navigation/elements';
import { Section } from '../components/Alignments';
import { Title, Subtext, Text } from '../components/Texts';
import { SimpleScreen } from '../components/Interface';
import { SearchBox } from '../components/Inputs';
import { Card, CardElement } from '../components/Cards';
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

// Mapeamento de dificuldade para exibição no card
const difficultyMap: Record<string, string> = {
    EASY: 'Fácil',
    MEDIUM: 'Médio',
    HARD: 'Difícil'
};

// Componente do Card de Resultado da Busca
function SearchResultCard({
    recipe,
    navigation
}: {
    recipe: Recipe;
    navigation: SearchNavigation;
}) {
    const imageUrl = recipe.images && recipe.images.length > 0 ? recipe.images[0] : null;

    return (
        <PlatformPressable onPress={() => navigation.navigate('ReadRecipe', { recipeId: recipe.id, title: recipe.title })}>
            <Card>
                <CardElement horizontal gap={16} centerVertical>
                    {imageUrl ? (
                        <Image source={{ uri: imageUrl }} style={localStyles.recipeImage} />
                    ) : (
                        <View style={[localStyles.recipeImage, { backgroundColor: '#E0E0E0' }]} />
                    )}
                    
                    <Section style={{ flex: 1 }} gap={4}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1A1A1A' }}>
                            {recipe.title}
                        </Text>
                        <Subtext style={{ fontSize: 13, color: '#888888' }}>
                            {recipe.difficulty ? difficultyMap[recipe.difficulty] : 'Sem dificuldade'} • {recipe.timeMinutes ? `${recipe.timeMinutes} min` : '-- min'}
                        </Subtext>
                    </Section>
                </CardElement>
            </Card>
        </PlatformPressable>
    );
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
            if (!debouncedQuery.trim()) {
                setResults([]);
                setHasSearched(false);
                return;
            }

            try {
                setLoading(true);
                setHasSearched(true);
                
                // Passamos undefined/as any para os parâmetros não obrigatórios para focar na busca por título
                const data = await recipeService.searchRecipes(debouncedQuery, [], undefined as any, '');
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

const localStyles = {
    recipeImage: {
        width: 64,
        height: 64,
        borderRadius: 12
    } as ImageStyle
};