import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { PlatformPressable } from '@react-navigation/elements';
import { Section } from '../components/Alignments';
import { BigAccentButton, SlimSimpleButton } from '../components/Buttons';
import { Card, CardElement } from '../components/Cards';
import { Input } from '../components/Inputs';
import { SimpleScreen } from '../components/Interface';
import { Header, Subtext, Text, TitleWithBackButton } from '../components/Texts';
import { ScreenNavigation } from '../components/Types';
import { useThemeMode } from '../components/ThemeProvider';
import globalColors from '../styles/Colors';
import RecipeBookService from '../services/RecipeBookService';
import type { RecipeBook } from '../model/RecipeBook';
import type { BookComponent } from '../model/BookComponent';
import { getAuthenticatedUserId } from '../services/AuthSession';
import { consumePendingRecipeReturn } from '../utils/RecipeBookRecipeReturn';

const Draggable: any = DraggableFlatList as any;
const recipeBookService = new RecipeBookService();

type EditRecipeBookNavigation = ScreenNavigation<{
    ReadRecipeBook: { bookId: string; title: string };
    Saved: undefined;
    AddRecipe: { bookBookId?: string; bookItemKey?: string; recipeId?: string };
}> & {
    goBack: () => void;
};

type EditRecipeBookRoute = {
    params?: {
        bookId?: string;
        createdRecipeId?: string;
        createdRecipeTitle?: string;
        createdRecipeKey?: string;
    };
};

type DraftCategory = {
    key: string;
    type: 'CATEGORY';
    name: string;
    items: DraftBookComponent[];
};

type DraftRecipeRef = {
    key: string;
    type: 'RECIPE';
    recipeId: string;
    title: string;
};

type DraftTextRef = {
    key: string;
    type: 'TEXT';
    textId: string;
    title: string;
};

type DraftBookComponent = DraftCategory | DraftRecipeRef | DraftTextRef;

function createKey(): string {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function createDraftItem(type: DraftBookComponent['type']): DraftBookComponent {
    if (type === 'CATEGORY') {
        return {
            key: createKey(),
            type,
            name: '',
            items: []
        };
    }

    return {
        key: createKey(),
        type,
        ...(type === 'RECIPE' ? { recipeId: '', title: '' } : { textId: '', title: '' })
    } as DraftRecipeRef | DraftTextRef;
}

function draftFromComponent(item: BookComponent): DraftBookComponent {
    if (item.type === 'CATEGORY') {
        return {
            key: createKey(),
            type: 'CATEGORY',
            name: item.name ?? '',
            items: item.items.map(draftFromComponent)
        };
    }

    if (item.type === 'RECIPE') {
        return {
            key: createKey(),
            type: 'RECIPE',
            recipeId: item.recipeId ?? '',
            title: item.title ?? ''
        };
    }

    return {
        key: createKey(),
        type: 'TEXT',
        textId: item.textId ?? '',
        title: item.title ?? ''
    };
}

function draftToComponent(item: DraftBookComponent): BookComponent {
    if (item.type === 'CATEGORY') {
        return {
            type: 'CATEGORY',
            name: item.name.trim(),
            items: item.items.map(draftToComponent)
        };
    }

    if (item.type === 'RECIPE') {
        return {
            type: 'RECIPE',
            recipeId: item.recipeId.trim(),
            title: item.title.trim()
        };
    }

    return {
        type: 'TEXT',
        textId: item.textId.trim(),
        title: item.title.trim()
    };
}

function updateRecipeDraft(items: DraftBookComponent[], targetKey: string | undefined, recipeId: string, title: string): DraftBookComponent[] {
    let updated = false;
    const normalizedRecipeId = recipeId.trim();

    const nextItems = items.map((item) => {
        if (item.key === targetKey) {
            updated = true;
            return {
                key: item.key,
                type: 'RECIPE',
                recipeId: normalizedRecipeId || (item.type === 'RECIPE' ? item.recipeId : ''),
                title
            } satisfies DraftRecipeRef;
        }

        if (item.type === 'CATEGORY') {
            const nestedItems = updateRecipeDraft(item.items, targetKey, recipeId, title);
            if (nestedItems !== item.items) {
                updated = true;
                return {
                    ...item,
                    items: nestedItems
                };
            }
        }

        return item;
    });

    if (!updated && targetKey == null) {
        return [
            ...items,
            {
                key: createKey(),
                type: 'RECIPE',
                recipeId: normalizedRecipeId,
                title
            }
        ];
    }

    return nextItems;
}

function parseTags(value: string): string[] {
    return value
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
}

function BookItemEditor({
    item,
    onChange,
    onDelete,
    drag,
    onCreateRecipe
}: {
    item: DraftBookComponent;
    onChange: (item: DraftBookComponent) => void;
    onDelete: () => void;
    drag: () => void;
    onCreateRecipe: (targetKey: string) => void;
}) {
    const { theme } = useThemeMode();
    const colors = globalColors(theme);

    return (
        <Card>
            <CardElement gap={12}>
                <Section horizontal spaceBetween centerVertical>
                    <Text accented>
                        {item.type === 'CATEGORY' ? 'Categoria' : item.type === 'RECIPE' ? 'Receita' : 'Texto'}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <PlatformPressable onLongPress={drag}>
                            <MaterialCommunityIcons name='drag' size={20} color={colors.subtext} />
                        </PlatformPressable>
                        <PlatformPressable onPress={onDelete}>
                            <MaterialCommunityIcons name='trash-can-outline' size={22} color={colors.subtext} style={{ marginLeft: 10 }} />
                        </PlatformPressable>
                    </View>
                </Section>

                {item.type === 'CATEGORY' ? (
                    <Section gap={10}>
                        <Header>Nome da categoria</Header>
                        <Input
                            placeholder='Categoria'
                            value={item.name}
                            onChangeText={(name) => onChange({ ...item, name })}
                            multiline
                            autoGrow
                            minHeight={52}
                        />

                        <Header>Itens da categoria</Header>
                        <BookItemsEditor
                            items={item.items}
                            onChange={(items) => onChange({ ...item, items })}
                            onCreateRecipe={onCreateRecipe}
                            nested
                        />
                    </Section>
                ) : item.type === 'RECIPE' ? (
                    <Section gap={10}>
                        <Header>ID da receita</Header>
                        <Input
                            placeholder='recipe-id'
                            value={item.recipeId}
                            onChangeText={(recipeId) => onChange({ ...item, recipeId })}
                            multiline
                            autoGrow
                            minHeight={52}
                        />

                        <Header>Título</Header>
                        <Input
                            placeholder='Nome da receita'
                            value={item.title}
                            onChangeText={(title) => onChange({ ...item, title })}
                            multiline
                            autoGrow
                            minHeight={52}
                        />
                    </Section>
                ) : (
                    <Section gap={10}>
                        <Header>ID do texto</Header>
                        <Input
                            placeholder='text-id'
                            value={item.textId}
                            onChangeText={(textId) => onChange({ ...item, textId })}
                            multiline
                            autoGrow
                            minHeight={52}
                        />

                        <Header>Título</Header>
                        <Input
                            placeholder='Nome do texto'
                            value={item.title}
                            onChangeText={(title) => onChange({ ...item, title })}
                            multiline
                            autoGrow
                            minHeight={52}
                        />
                    </Section>
                )}
            </CardElement>
        </Card>
    );
}

function BookItemsEditor({
    items,
    onChange,
    onCreateRecipe,
    nested = false
}: {
    items: DraftBookComponent[];
    onChange: (items: DraftBookComponent[]) => void;
    onCreateRecipe: (targetKey: string) => void;
    nested?: boolean;
}) {
    const addItem = (type: DraftBookComponent['type']) => {
        if (type === 'RECIPE') {
            const draft = createDraftItem('RECIPE');
            onChange([...items, draft]);
            onCreateRecipe(draft.key);
            return;
        }

        onChange([...items, createDraftItem(type)]);
    };

    return (
        <Section gap={12} style={nested ? { paddingLeft: 10 } : undefined}>
            {items.length > 0 ? (
                <Draggable
                    data={items}
                    keyExtractor={(item: DraftBookComponent) => item.key}
                    onDragEnd={({ data }: { data: DraftBookComponent[] }) => onChange(data)}
                    renderItem={({ item, drag }: { item: DraftBookComponent; drag: () => void }) => (
                        <BookItemEditor
                            item={item}
                            drag={drag}
                            onDelete={() => onChange(items.filter((existing) => existing.key !== item.key))}
                            onChange={(updatedItem) => {
                                onChange(items.map((existing) => (existing.key === item.key ? updatedItem : existing)));
                            }}
                            onCreateRecipe={onCreateRecipe}
                        />
                    )}
                />
            ) : (
                <Subtext style={{ textAlign: 'center' }}>Sem itens nesta seção</Subtext>
            )}

            <Section horizontal gap={8}>
                <SlimSimpleButton onPress={() => addItem('CATEGORY')}>+ Categoria</SlimSimpleButton>
                <SlimSimpleButton onPress={() => addItem('RECIPE')}>+ Receita</SlimSimpleButton>
                <SlimSimpleButton onPress={() => addItem('TEXT')}>+ Texto</SlimSimpleButton>
            </Section>
        </Section>
    );
}

export default function EditRecipeBook({ navigation, route }: { navigation: EditRecipeBookNavigation; route?: EditRecipeBookRoute }) {
    const { theme } = useThemeMode();
    const bookId = route?.params?.bookId;
    const isEditing = Boolean(bookId);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [title, setTitle] = useState('');
    const [descriptionMD, setDescriptionMD] = useState('');
    const [tagsText, setTagsText] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [items, setItems] = useState<DraftBookComponent[]>([]);
    const [book, setBook] = useState<RecipeBook | null>(null);
    const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

    useEffect(() => {
        const createdRecipeId = route?.params?.createdRecipeId;
        const createdRecipeTitle = route?.params?.createdRecipeTitle;
        const createdRecipeKey = route?.params?.createdRecipeKey;

        if (!createdRecipeId || !createdRecipeTitle) {
            return;
        }

        setItems((currentItems) => updateRecipeDraft(currentItems, createdRecipeKey, createdRecipeId, createdRecipeTitle));
    }, [route?.params?.createdRecipeId, route?.params?.createdRecipeKey, route?.params?.createdRecipeTitle]);

    useFocusEffect(
        useCallback(() => {
            const pendingReturn = consumePendingRecipeReturn();
            if (!pendingReturn || pendingReturn.bookId !== bookId) {
                return;
            }

            setItems((currentItems) => updateRecipeDraft(currentItems, pendingReturn.recipeKey, pendingReturn.recipeId, pendingReturn.recipeTitle));
        }, [bookId])
    );

    useEffect(() => {
        if (!isEditing || !bookId) {
            return;
        }

        let mounted = true;

        const load = async () => {
            try {
                setLoading(true);
                const book = await recipeBookService.getRecipeBookById(bookId);

                if (!mounted) {
                    return;
                }

                setBook(book);
                setTitle(book.title ?? '');
                setDescriptionMD(book.descriptionMD ?? '');
                setTagsText((book.tags ?? []).join(', '));
                setIsPublic(book.isPublic ?? true);
                setItems((book.items ?? []).map(draftFromComponent));
            } catch (error) {
                console.error('Failed to load book for editing', error);
                Alert.alert('Erro', 'Não foi possível carregar o livro para edição.');
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        void load();

        return () => {
            mounted = false;
        };
    }, [bookId, isEditing]);

    const handleSubmit = async () => {
        if (!title.trim()) {
            Alert.alert('Título necessário', 'Informe um título para o livro de receitas.');
            return;
        }

        setSaving(true);

        try {
            const authenticatedUserId = await getAuthenticatedUserId();
            const payload: RecipeBook = {
                id: book?.id ?? bookId ?? '',
                ownerId: book?.ownerId ?? authenticatedUserId ?? '',
                title: title.trim(),
                descriptionMD,
                tags: parseTags(tagsText),
                isPublic,
                items: items.map(draftToComponent),
                createdAt: book?.createdAt ?? null,
                updatedAt: book?.updatedAt ?? null,
                rating: book?.rating ?? 0
            };

            const updated = await recipeBookService.updateRecipeBook(payload);
            setBook(updated);
            navigation.goBack();
        } catch (error) {
            console.error('Failed to save book', error);
            Alert.alert('Erro', 'Não foi possível atualizar o livro.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!bookId) {
            return;
        }

        setDeleteConfirmVisible(false);

        try {
            setSaving(true);
            await recipeBookService.deleteRecipeBook(bookId);
            (navigation as any).dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Tabs', params: { screen: 'Saved' } as any }]
                })
            );
        } catch (error) {
            console.error('Failed to delete book', error);
            Alert.alert('Erro', 'Não foi possível excluir o livro.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <SimpleScreen scrollPadding>
            <Section horizontal spaceBetween centerVertical style={{ marginBottom: 10 }}>
                <TitleWithBackButton navigation={navigation}>Editar livro</TitleWithBackButton>
            </Section>

            {loading ? (
                <Section centerVertical style={{ minHeight: 220 }}>
                    <ActivityIndicator color={globalColors(theme).accent[0]} />
                    <Subtext style={{ marginTop: 10 }}>Carregando livro...</Subtext>
                </Section>
            ) : (
                <Section gap={15}>
                    <Section gap={10}>
                        <Header>Título</Header>
                        <Input
                            placeholder='Título do livro'
                            value={title}
                            onChangeText={setTitle}
                            multiline
                            autoGrow
                            minHeight={54}
                        />
                    </Section>

                    <Section gap={10}>
                        <Header>Descrição</Header>
                        <Input
                            placeholder='Breve descrição'
                            value={descriptionMD}
                            onChangeText={setDescriptionMD}
                            big
                            multiline
                            autoGrow
                            minHeight={110}
                        />
                    </Section>

                    <Section gap={10}>
                        <Header>Tags</Header>
                        <Input
                            placeholder='ex: sobremesa, regional, autoral'
                            value={tagsText}
                            onChangeText={setTagsText}
                            multiline
                            autoGrow
                            minHeight={54}
                        />
                    </Section>

                    <Section gap={10}>
                        <Header>Privacidade</Header>
                        <PlatformPressable
                            onPress={() => setIsPublic((current) => !current)}
                            style={{
                                paddingHorizontal: 16,
                                paddingVertical: 14,
                                borderRadius: 16,
                                borderWidth: 1,
                                borderColor: globalColors(theme).divider,
                                backgroundColor: globalColors(theme).foreground
                            }}
                        >
                            <Text>{isPublic ? 'Público' : 'Privado'}</Text>
                            <Subtext>{isPublic ? 'Qualquer pessoa pode encontrar este livro.' : 'Apenas você pode ver este livro.'}</Subtext>
                        </PlatformPressable>
                    </Section>

                    <Section gap={10}>
                        <Header>Conteúdo</Header>
                        <BookItemsEditor
                            items={items}
                            onChange={setItems}
                            onCreateRecipe={(recipeKey) => {
                                if (!bookId) {
                                    return;
                                }

                                (navigation as any).navigate('AddRecipe', {
                                    bookBookId: bookId,
                                    bookItemKey: recipeKey
                                });
                            }}
                        />
                    </Section>

                    <Section>
                        {saving ? (
                            <ActivityIndicator color={globalColors(theme).accent[0]} />
                        ) : (
                            <BigAccentButton onPress={() => void handleSubmit()}>
                                Salvar alterações
                            </BigAccentButton>
                        )}
                    </Section>

                    <Section>
                        <PlatformPressable
                            onPress={() => setDeleteConfirmVisible(true)}
                            style={{
                                paddingHorizontal: 16,
                                paddingVertical: 14,
                                borderRadius: 16,
                                borderWidth: 1,
                                borderColor: '#c0392b',
                                alignItems: 'center'
                            }}
                            disabled={saving}
                        >
                            <Text style={{ color: '#c0392b' }}>Excluir livro</Text>
                        </PlatformPressable>
                    </Section>
                </Section>
            )}

            <Modal
                transparent
                visible={deleteConfirmVisible}
                animationType='fade'
                onRequestClose={() => setDeleteConfirmVisible(false)}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 }}>
                    <View style={{ borderRadius: 20, padding: 20, backgroundColor: globalColors(theme).foreground, gap: 14 }}>
                        <Header>Excluir livro</Header>
                        <Subtext>
                            Tem certeza que deseja excluir este livro de receitas? Esta ação não pode ser desfeita.
                        </Subtext>

                        <Section horizontal gap={10}>
                            <SlimSimpleButton onPress={() => setDeleteConfirmVisible(false)}>Cancelar</SlimSimpleButton>
                            <BigAccentButton onPress={() => void handleDelete()}>
                                Excluir
                            </BigAccentButton>
                        </Section>
                    </View>
                </View>
            </Modal>
        </SimpleScreen>
    );
}
