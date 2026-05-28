import { useEffect, useState } from "react";
import { SimpleScreen } from "../components/Interface";
import { RecipeList } from "../components/RecipeList";
import { Subtext, TitleWithBackButton } from "../components/Texts";
import { Difficulty } from "../model/Difficulty";
import { Recipe } from "../model/Recipe";
import RecipeService from "../services/RecipeService";
import { ScreenNavigation } from "../components/Types";

type FavoritedNavigation = ScreenNavigation<{}> & {
    goBack: () => void;
};

const recipeService = new RecipeService();

const mockRecipes: Recipe[] = [
    { id: '69f7b394db9505323b334bdb', images: [], tags: ['bolo', 'chocolate', 'doce'], title: 'Bolo de Chocolate', authorId: '123', difficulty: Difficulty.MEDIUM, timeMinutes: 60, portions: 8, descriptionMD: 'Delicioso bolo de chocolate', ingredientSections: [], stepsMD: [], isPublic: true, createdAt: null, updatedAt: null },
    { id: '2', images: [], tags: ['salada', 'caesar'], title: 'Salada Caesar', authorId: '456', difficulty: Difficulty.EASY, timeMinutes: 30, portions: 4, descriptionMD: 'Saborosa salada Caesar', ingredientSections: [], stepsMD: [], isPublic: true, createdAt: null, updatedAt: null },
    { id: '3', images: [], tags: ['macarrão', 'bolonhesa'], title: 'Macarrão à Bolonhesa', authorId: '789', difficulty: Difficulty.HARD, timeMinutes: 45, portions: 6, descriptionMD: 'Delicioso macarrão à bolonhesa', ingredientSections: [], stepsMD: [], isPublic: true, createdAt: null, updatedAt: null },
];

export default function Favorited({ navigation }: { navigation: FavoritedNavigation }) {
    const [data, setData] = useState<Recipe[]>([]);

    useEffect(() => {
        const fetchFavoriteRecipes = async () => {
            const favoriteRecipes = await recipeService.getMyFavoriteRecipes();
            setData(favoriteRecipes);
        };

        fetchFavoriteRecipes();
    }, []);

    return (
        <SimpleScreen>
            <TitleWithBackButton navigation={navigation}>Receitas favoritas</TitleWithBackButton>
            {data.length === 0 ? <Subtext style={{ marginTop: 150, textAlign: 'center' }}>Nenhuma receita favoritada ainda</Subtext> : <></>}
            <RecipeList data={data} navigation={navigation} />
        </SimpleScreen>
    );
}