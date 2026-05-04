import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageStyle, Pressable } from 'react-native';
import { Section } from '../components/Alignments';
import { SimpleScreen } from '../components/Interface';
import { Subtext, TitleWithBackButton, Text, Header } from '../components/Texts';
import { ScreenNavigation } from '../components/Types';
import RecipeBookService from '../services/RecipeBookService';
import UserService from '../services/UserService';
import { RecipeBook } from '../model/RecipeBook';
import type { UserPublic } from '../model/dto/UserPublic';
import { useThemeMode } from '../components/ThemeProvider';
import globalColors from '../styles/Colors';
import { SearchBox } from '../components/Inputs';
import { Card, CardElement } from '../components/Cards';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BookContent } from '../components/BookContent';
import { getAuthenticatedUserId } from '../services/AuthSession';

type ReadRecipeBookNavigation = ScreenNavigation<{}> & {
    goBack: () => void;
    navigate: (screen: string, params: any) => void;
};

type ReadRecipeBookProps = {
    navigation: ReadRecipeBookNavigation;
    bookId: string;
    title?: string;
};

const recipeBookService = new RecipeBookService();
const userService = new UserService();

export default function ReadRecipeBook({ navigation, bookId, title }: ReadRecipeBookProps) {
    const [authenticatedUserId, setAuthenticatedUserId] = useState<string | null>(null);
    const { theme } = useThemeMode();
    const [book, setBook] = useState<RecipeBook | null>(null);
    const [owner, setOwner] = useState<UserPublic | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [savingStatus, setSavingStatus] = useState(false);

    useEffect(() => {
        let mounted = true;

        const fetchBook = async () => {
            try {
                const fetchedBook = await recipeBookService.getRecipeBookById(bookId);
                if (mounted) {
                    setBook(fetchedBook);

                    try {
                        const authId = await getAuthenticatedUserId();
                        setAuthenticatedUserId(authId);
                        const ownerProfile = await userService.getPublicProfileById(fetchedBook.ownerId);
                        if (mounted) {
                            setOwner(ownerProfile);
                        }
                    } catch (error) {
                        console.error('Failed to fetch owner profile:', error);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch book:', error);
            }
        };

        void fetchBook();

        return () => {
            mounted = false;
        };
    }, [bookId]);

    const toggleSaveBook = async () => {
        if (savingStatus) return;
        
        setSavingStatus(true);
        try {
            if (isSaved) {
                await recipeBookService.unsaveRecipeBook(bookId);
                setIsSaved(false);
            } else {
                await recipeBookService.saveRecipeBook(bookId);
                setIsSaved(true);
            }
        } catch (error) {
            console.error('Failed to toggle save status:', error);
        } finally {
            setSavingStatus(false);
        }
    };

    const displayedTitle = book?.title ?? title ?? 'Livro de receitas';

    return (
        <SimpleScreen>
            <Section horizontal gap={10} centerVertical style={{ marginBottom: 10 }}>
                <TitleWithBackButton navigation={navigation}>{displayedTitle}</TitleWithBackButton>
                {book?.ownerId != authenticatedUserId && authenticatedUserId == null && (
                    <Pressable onPress={toggleSaveBook} disabled={savingStatus}>
                        <MaterialCommunityIcons
                            name={isSaved ? 'bookmark' : 'bookmark-outline'}
                            size={24}
                            color={isSaved ? globalColors(theme).accent[0] : globalColors(theme).subtext}
                        />
                    </Pressable>
                )}
            </Section>

            {!book || !owner ? (
                <Section centerVertical style={{ minHeight: 240 }}>
                    <ActivityIndicator color={globalColors(theme).accent[0]} />
                    <Subtext style={{ marginTop: 10 }}>Carregando livro...</Subtext>
                </Section>
            ) : (
                <Section gap={15}>
                    <SearchBox value={searchQuery} onChangeText={setSearchQuery} placeholder="Buscar receitas e textos..." />

                    <Section gap={10}>
                        <Text>{book.descriptionMD}</Text>
                        <Subtext>{book.tags.length > 0 ? book.tags.map(tag => `#${tag}`).join(' ') : 'Sem tags'}</Subtext>
                    </Section>

                    <Pressable onPress={() => navigation.navigate('Profile', {})}>
                        <Card>
                            <CardElement horizontal gap={15} centerVertical>
                                <Image
                                    source={owner.avatarUrl ? { uri: owner.avatarUrl } : require('../assets/default-avatar.png')}
                                    style={ownerAvatarStyle}
                                />
                                <Section style={{ flex: 1 }}>
                                    <Header>{owner.name}</Header>
                                    <Subtext>@{owner.handle}</Subtext>
                                </Section>
                            </CardElement>
                        </Card>
                    </Pressable>

                    <BookContent items={book.items} navigation={navigation as any} filter={searchQuery} />
                </Section>
            )}
        </SimpleScreen>
    );
}

const ownerAvatarStyle: ImageStyle = {
    width: 48,
    height: 48,
    borderRadius: 24
};