import { useState } from 'react';
import { Pressable } from 'react-native';
import { BookComponent } from '../model/BookComponent';
import { Category } from '../model/Category';
import { RecipeRef } from '../model/RecipeRef';
import { TextRef } from '../model/TextRef';
import { Section } from './Alignments';
import { Card, CardElement } from './Cards';
import { Header, Subtext, Text } from './Texts';
import { useThemeMode } from './ThemeProvider';
import globalColors from '../styles/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScreenNavigation } from './Types';

type BookContentNavigation = ScreenNavigation<{
    ReadRecipe: { recipeId: string };
    ReadText: { textId: string };
}>;

function isCategory(item: BookComponent): item is Category {
    return item.type === 'CATEGORY';
}

function isRecipeRef(item: BookComponent): item is RecipeRef {
    return item.type === 'RECIPE';
}

function isTextRef(item: BookComponent): item is TextRef {
    return item.type === 'TEXT';
}

function BookEntryCard({
    item,
    navigation,
    expandedCategories,
    onToggleExpand
}: {
    item: BookComponent;
    navigation: BookContentNavigation;
    expandedCategories: Set<string>;
    onToggleExpand: (categoryName: string) => void;
}) {
    const { theme } = useThemeMode();

    if (isRecipeRef(item)) {
        return (
            <Pressable onPress={() => navigation.navigate('ReadRecipe', { recipeId: item.recipeId })}>
                <Card>
                    <CardElement horizontal gap={10} centerVertical>
                        <MaterialCommunityIcons name="book-open" size={20} color={globalColors(theme).accent[0]} />
                        <Section style={{ flex: 1 }}>
                            <Text>{item.title}</Text>
                        </Section>
                        <MaterialCommunityIcons name="chevron-right" size={20} color={globalColors(theme).inactive} />
                    </CardElement>
                </Card>
            </Pressable>
        );
    }

    if (isTextRef(item)) {
        return (
            <Pressable onPress={() => navigation.navigate('ReadText', { textId: item.textId })}>
                <Card>
                    <CardElement horizontal gap={10} centerVertical>
                        <MaterialCommunityIcons name="file-document" size={20} color={globalColors(theme).accent[0]} />
                        <Section style={{ flex: 1 }}>
                            <Text>{item.title}</Text>
                        </Section>
                        <MaterialCommunityIcons name="chevron-right" size={20} color={globalColors(theme).inactive} />
                    </CardElement>
                </Card>
            </Pressable>
        );
    }

    if (isCategory(item)) {
        const isExpanded = expandedCategories.has(item.name);

        return (
            <Section gap={10}>
                <Pressable onPress={() => onToggleExpand(item.name)}>
                    <Card>
                        <CardElement horizontal gap={10} centerVertical spaceBetween>
                            <Text accented>{item.name}</Text>
                            <MaterialCommunityIcons
                                name={isExpanded ? 'chevron-down' : 'chevron-right'}
                                size={20}
                                color={globalColors(theme).accent[0]}
                            />
                        </CardElement>
                    </Card>
                </Pressable>

                {isExpanded && (
                    <Section style={{ paddingLeft: 15 }} gap={10}>
                        {item.items.map((subItem, index) => (
                            <BookEntryCard
                                key={index}
                                item={subItem}
                                navigation={navigation}
                                expandedCategories={expandedCategories}
                                onToggleExpand={onToggleExpand}
                            />
                        ))}
                    </Section>
                )}
            </Section>
        );
    }

    return null;
}

export function BookContent({
    items,
    navigation,
    filter = ''
}: {
    items: BookComponent[];
    navigation: BookContentNavigation;
    filter?: string;
}) {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    const toggleExpand = (categoryName: string) => {
        const updated = new Set(expandedCategories);
        if (updated.has(categoryName)) {
            updated.delete(categoryName);
        } else {
            updated.add(categoryName);
        }
        setExpandedCategories(updated);
    };

    const filteredItems = filter.trim() === '' ? items : filterBookContent(items, filter);

    if (filteredItems.length === 0) {
        return <Subtext style={{ textAlign: 'center', marginTop: 20 }}>Nenhum resultado encontrado</Subtext>;
    }

    return (
        <Section gap={10}>
            {filteredItems.map((item, index) => (
                <BookEntryCard
                    key={index}
                    item={item}
                    navigation={navigation}
                    expandedCategories={expandedCategories}
                    onToggleExpand={toggleExpand}
                />
            ))}
        </Section>
    );
}

function filterBookContent(items: BookComponent[], query: string): BookComponent[] {
    const lowerQuery = query.toLowerCase();

    const fuzzyMatch = (text: string): boolean => {
        const lowerText = text.toLowerCase();
        let queryIndex = 0;

        for (let i = 0; i < lowerText.length && queryIndex < lowerQuery.length; i++) {
            if (lowerText[i] === lowerQuery[queryIndex]) {
                queryIndex++;
            }
        }

        return queryIndex === lowerQuery.length;
    };

    const matchesFilter = (item: BookComponent): boolean => {
        if (isRecipeRef(item) || isTextRef(item)) {
            return fuzzyMatch(item.title);
        }
        if (isCategory(item)) {
            return fuzzyMatch(item.name) || item.items.some(matchesFilter);
        }
        return false;
    };

    return items
        .map((item) => {
            if (isCategory(item) && item.items.some(matchesFilter)) {
                return {
                    ...item,
                    items: filterBookContent(item.items, query)
                };
            }
            return item;
        })
        .filter(matchesFilter);
}
