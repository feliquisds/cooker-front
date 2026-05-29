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