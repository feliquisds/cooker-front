import { FlatList, ImageStyle, type ListRenderItem } from 'react-native';
import { Subtext, Text } from './Texts';
import { Recipe } from '../model/Recipe';
import { Card, CardElement } from './Cards';
import { PlatformPressable } from '@react-navigation/elements';
import { Section } from './Alignments';
import { DifficultyChip, PortionChip, TimeChip } from './Chip';
import { Image } from 'react-native';
import { ScreenNavigation } from './Types';

type RecipeListNavigation = ScreenNavigation<{
    ReadRecipe: { recipeId: string };
}>;

export function RecipeList({data, navigation}: {data: Recipe[], navigation: RecipeListNavigation}) {
    const renderRecipe: ListRenderItem<Recipe> = ({ item }) => (
        <PlatformPressable onPress={() => navigation.navigate('ReadRecipe', { recipeId: item.id })}>
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
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={renderRecipe}
            contentContainerStyle={{ gap: 15 }}
        />
    );
}

const imageStyle: ImageStyle = {
    width: '100%',
    height: 100,
    borderRadius: 15,
};