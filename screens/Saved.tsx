import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageStyle, StyleSheet, View } from 'react-native';
import { PlatformPressable } from '@react-navigation/elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card, CardElement } from '../components/Cards';
import { Section } from '../components/Alignments';
import { SimpleScreen } from '../components/Interface';
import { Subtext, Text, Title } from '../components/Texts';
import { ScreenNavigation } from '../components/Types';
import RecipeBookService from '../services/RecipeBookService';
import UserService from '../services/UserService';
import { RecipeBook } from '../model/RecipeBook';
import type { UserPublic } from '../model/dto/UserPublic';
import { useThemeMode } from '../components/ThemeProvider';
import globalColors from '../styles/Colors';
import { getAuthenticatedUserId } from '../services/AuthSession';

type SavedNavigation = ScreenNavigation<{
    ReadRecipeBook: { bookId: string; title: string };
    AddRecipeBook: undefined;
}>;

const recipeBookService = new RecipeBookService();
const userService = new UserService();

function formatDate(value?: string | null): string {
    if (!value) {
        return 'Sem data de atualização';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return 'Sem data de atualização';
    }

    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function SavedBookCard({
    book,
    navigation,
    authorAvatarUrl,
    theme
}: {
    book: RecipeBook;
    navigation: SavedNavigation;
    authorAvatarUrl?: string | null;
    theme: 'light' | 'dark';
}) {
    const authorAvatar = authorAvatarUrl ? { uri: authorAvatarUrl } : (theme === 'light' ? require('../assets/default-avatar-black.png') : require('../assets/default-avatar-white.png'));
    const updatedAt = formatDate(book.updatedAt);

    return (
        <PlatformPressable onPress={() => navigation.navigate('ReadRecipeBook', { bookId: book.id, title: book.title })}>
            <Card>
                <CardElement horizontal gap={15} centerVertical>
                    <Section style={{ flex: 1 }} gap={5}>
                        <Text>{book.title}</Text>
                        <Subtext>{book.tags.length > 0 ? book.tags.map(tag => `#${tag}`).join(' ') : 'Sem tags'}</Subtext>
                        <Subtext>Atualizado em {updatedAt}</Subtext>
                    </Section>

                    <Image source={authorAvatar} style={localStyles.avatar} />
                </CardElement>
            </Card>
        </PlatformPressable>
    );
}

export default function Saved({ navigation }: { navigation: SavedNavigation }) {
    const { theme } = useThemeMode();
    const [books, setBooks] = useState<RecipeBook[]>([]);
    const [authorAvatars, setAuthorAvatars] = useState<Record<string, string | null>>({});
    const [loading, setLoading] = useState(true);
    const [authenticatedUserId, setAuthenticatedUserId] = useState<string | null>(null);

    const fetchSavedBooks = async () => {
        try {
            const savedBooks = await recipeBookService.getSavedRecipeBooks();
            setBooks(savedBooks);

            const uniqueOwnerIds = [...new Set(savedBooks.map((book) => book.ownerId))];
            const avatarEntries = await Promise.all(
                uniqueOwnerIds.map(async (ownerId) => {
                    try {
                        const profile: UserPublic = await userService.getPublicProfileById(ownerId);
                        return [ownerId, profile.avatarUrl] as const;
                    } catch {
                        return [ownerId, null] as const;
                    }
                })
            );

            setAuthorAvatars(Object.fromEntries(avatarEntries));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void getAuthenticatedUserId().then(setAuthenticatedUserId);
        void fetchSavedBooks();
    }, []);

    const floatingCreateButton = authenticatedUserId ? (
        <View pointerEvents='box-none' style={localStyles.floatingButtonWrap}>
            <PlatformPressable
                onPress={() => (navigation as any).navigate('AddRecipeBook')}
                style={[localStyles.floatingButton, { backgroundColor: globalColors(theme).accent[0] }]}
            >
                <MaterialCommunityIcons name='plus' size={20} color={globalColors(theme).buttonText} />
                <Text style={{ color: globalColors(theme).buttonText }}>Novo livro</Text>
            </PlatformPressable>
        </View>
    ) : null;

    return (
        <SimpleScreen tabScreen onRefresh={fetchSavedBooks} overlay={floatingCreateButton}>
            <Section gap={15}>
                <Section horizontal spaceBetween centerVertical>
                    <Title>Salvo</Title>
                </Section>

                {loading ? (
                    <Section centerVertical style={{ minHeight: 240 }}>
                        <ActivityIndicator color={globalColors(theme).accent[0]} />
                    </Section>
                ) : books.length === 0 ? (
                    <Section centerVertical style={{ minHeight: 240 }}>
                        <Subtext style={{ textAlign: 'center' }}>Nenhum livro de receitas salvo ainda</Subtext>
                    </Section>
                ) : (
                    <Section gap={15}>
                        {books.map((book) => (
                            <SavedBookCard
                                key={book.id}
                                book={book}
                                navigation={navigation}
                                authorAvatarUrl={authorAvatars[book.ownerId]}
                                theme={theme}
                            />
                        ))}
                    </Section>
                )}
            </Section>
        </SimpleScreen>
    );
}

const localStyles = StyleSheet.create({
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28
    },
    floatingButtonWrap: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
    floatingButton: {
        position: 'absolute',
        right: 20,
        bottom: 112,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 18,
        paddingVertical: 14,
        borderRadius: 999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8
    }
});