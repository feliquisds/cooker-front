import { ImageStyle, Image, Pressable } from "react-native";
import { Section } from "../components/Alignments";
import { DifficultyChip, PortionChip, TimeChip } from "../components/Chip";
import { SimpleScreen } from "../components/Interface";
import { Header, Subtext, Text, TitleWithBackButton } from "../components/Texts";
import { ScreenNavigation } from "../components/Types";
import { Recipe } from "../model/Recipe";
import { Card, CardElement } from "../components/Cards";
import RecipeService from "../services/RecipeService";
import { useEffect, useState } from "react";
import { useThemeMode } from "../components/ThemeProvider";
import globalColors from "../styles/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const recipeService = new RecipeService();

type ReadRecipeNavigation = ScreenNavigation<{}> & {
    goBack: () => void;
};

export default function ReadRecipe({ navigation, recipeId }: { navigation: ReadRecipeNavigation; recipeId: string }) {
    const { theme } = useThemeMode();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

    const toggleIngredient = (index: number) => {
        const updated = new Set(checkedIngredients);
        if (updated.has(index)) {
            updated.delete(index);
        } else {
            updated.add(index);
        }
        setCheckedIngredients(updated);
    };

    useEffect(() => {
        const fetchRecipe = async () => {
            const fetchedRecipe = await recipeService.getRecipeById(recipeId);
            setRecipe(fetchedRecipe);
        }

        fetchRecipe();
    }, [recipeId]);

    if (!recipe) {
        return (
            <SimpleScreen>
                <TitleWithBackButton navigation={navigation}></TitleWithBackButton>
            </SimpleScreen>
        );
    }

    return (
        <SimpleScreen>
            <TitleWithBackButton navigation={navigation}>{recipe.title}</TitleWithBackButton>
            <Section horizontal gap={10}>
                <DifficultyChip difficulty={recipe.difficulty} />
                <TimeChip time={recipe.timeMinutes} />
                <PortionChip portions={recipe.portions} />
            </Section>
            <Subtext>{recipe.tags.map(tag => `#${tag}`).join(' ')}</Subtext>
            {recipe.images != null && recipe.images.length > 0 && <Image source={{ uri: recipe.images[0] }} style={imageStyle} />}

            <Text>{recipe.descriptionMD}</Text>

            <Card>
                <CardElement gap={10}>
                    <Header accented>Ingredientes</Header>
                    {recipe.ingredients.map((ingredient, index) => (
                        <Pressable onPress={() => toggleIngredient(index)}>
                            <Section horizontal centerVertical gap={10} key={index}>
                                <MaterialCommunityIcons
                                    name={checkedIngredients.has(index) ? 'checkbox-marked' : 'checkbox-blank-outline'}
                                    size={20}
                                    color={globalColors(theme).text}
                                />
                                <Text style={checkedIngredients.has(index) ? { textDecorationLine: 'line-through', opacity: 0.5 } : {}}>
                                    {ingredient.quantity}{ingredient.unit} de {ingredient.name}
                                </Text>
                            </Section>
                        </Pressable>
                    ))}
                </CardElement>
            </Card>

            <Card>
                <CardElement gap={10}>
                    <Header accented>Modo de preparo</Header>
                    {recipe.stepsMD.map((step, index) => (
                        <Section centerVertical horizontal gap={10} key={index}>
                            <Header accented>{index + 1}.</Header>
                            <Text>{step}</Text>
                        </Section>
                    ))}
                </CardElement>
            </Card>
        </SimpleScreen>
    );
}

const imageStyle: ImageStyle = {
    width: '100%',
    height: 200,
    borderRadius: 15,
};