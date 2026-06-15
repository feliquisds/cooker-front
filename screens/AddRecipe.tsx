import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { Section } from '../components/Alignments';
import { SimpleScreen } from '../components/Interface';
import { Header, Text, TitleWithBackButton } from '../components/Texts';
import { Input } from '../components/Inputs';
import { BigAccentButton, SlimSimpleButton } from '../components/Buttons';
import { useThemeMode } from '../components/ThemeProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Difficulty } from '../model/Difficulty';
import type { IngredientSection } from '../model/IngredientSection';
import type { Recipe } from '../model/Recipe';
import RecipeService from '../services/RecipeService';
import { ActivityIndicator, Alert, View } from 'react-native';
import { NestableDraggableFlatList, NestableScrollContainer } from 'react-native-draggable-flatlist';
// Some versions export a generic component type that TypeScript won't accept in JSX directly.
// Cast to `any` and use the alias `Draggable` in JSX to avoid TSX typing errors.
const Draggable: any = NestableDraggableFlatList as any;
import globalColors from '../styles/Colors';
import globalStyles from '../styles/Styles';
import { PlatformPressable } from '@react-navigation/elements';
import { ScreenNavigation } from '../components/Types';
import { setPendingRecipeReturn } from '../utils/RecipeBookRecipeReturn';

const recipeService = new RecipeService();

const difficultyOptions = [
  { value: Difficulty.EASY, label: 'Fácil', stars: 1 },
  { value: Difficulty.MEDIUM, label: 'Média', stars: 2 },
  { value: Difficulty.HARD, label: 'Difícil', stars: 3 }
] as const;

type StepItem = {
  key: string;
  text: string;
};

function createStepKey() {
  return `step-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function StepRow({
  step,
  index,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  drag,
  showDragHandle = true
}: {
  step: StepItem;
  index: number;
  onChange: (value: string) => void;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  drag?: () => void;
  showDragHandle?: boolean;
}) {
  const { theme } = useThemeMode();

  return (
    <Section horizontal gap={10} centerVertical>
      <Input
        style={{ flex: 1 }}
        placeholder={`Passo ${index + 1}`}
        value={step.text}
        onChangeText={onChange}
        multiline
        autoGrow
        minHeight={58}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {showDragHandle && drag ? (
          <PlatformPressable onLongPress={drag}>
            <MaterialCommunityIcons name='drag' size={20} style={{ color: globalColors(theme).subtext, marginHorizontal: 6 }} />
          </PlatformPressable>
        ) : null}
        {onMoveUp ? (
          <PlatformPressable onPress={onMoveUp}>
            <MaterialCommunityIcons name='chevron-up' size={18} style={{ color: globalColors(theme).subtext, marginHorizontal: 6 }} />
          </PlatformPressable>
        ) : null}
        {onMoveDown ? (
          <PlatformPressable onPress={onMoveDown}>
            <MaterialCommunityIcons name='chevron-down' size={18} style={{ color: globalColors(theme).subtext, marginHorizontal: 6 }} />
          </PlatformPressable>
        ) : null}
        <PlatformPressable onPress={onRemove}>
          <MaterialCommunityIcons name='close' size={20} style={{ color: globalColors(theme).subtext }} />
        </PlatformPressable>
      </View>
    </Section>
  );
}

function IngredientRow({
  ingredient,
  sectionIndex,
  ingredientIndex,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown
}: {
  ingredient: string;
  sectionIndex: number;
  ingredientIndex: number;
  onChange: (value: string) => void;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  const { theme } = useThemeMode();

  return (
    <Section horizontal gap={8} centerVertical>
      <Input
        style={{ flex: 1 }}
        placeholder='Ingrediente'
        value={ingredient}
        onChangeText={onChange}
        multiline
        autoGrow
        minHeight={52}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {onMoveUp ? (
          <PlatformPressable onPress={onMoveUp} disabled={ingredientIndex === 0}>
            <MaterialCommunityIcons name='chevron-up' size={18} style={{ color: globalColors(theme).subtext, marginHorizontal: 6 }} />
          </PlatformPressable>
        ) : null}
        {onMoveDown ? (
          <PlatformPressable onPress={onMoveDown} disabled={false}>
            <MaterialCommunityIcons name='chevron-down' size={18} style={{ color: globalColors(theme).subtext, marginHorizontal: 6 }} />
          </PlatformPressable>
        ) : null}
        <PlatformPressable onPress={onRemove}>
          <MaterialCommunityIcons name='close' size={20} style={{ color: globalColors(theme).subtext }} />
        </PlatformPressable>
      </View>
    </Section>
  );
}

type AddRecipeNavigation = ScreenNavigation<{}> & { goBack: () => void };

type AddRecipeRoute = {
  params?: {
    recipeId?: string;
    bookBookId?: string;
    bookItemKey?: string;
  };
};

function DifficultyPicker({ difficulty, onChange }: { difficulty: Difficulty; onChange: (difficulty: Difficulty) => void }) {
  const { theme } = useThemeMode();

  return (
    <Section horizontal gap={10}>
      {difficultyOptions.map((option) => {
        const selected = difficulty === option.value;
        const colors = globalColors(theme);
        const outlineColor = selected ? colors.accent[0] : colors.divider;
        const starColor = selected ? colors.accent[0] : colors.subtext;

        return (
          <PlatformPressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={{
              flex: 1,
              borderWidth: 2,
              borderColor: outlineColor,
              borderRadius: 20,
              paddingVertical: 10,
              paddingHorizontal: 8,
              alignItems: 'center',
              gap: 4,
              backgroundColor: selected ? colors.foreground : 'transparent'
            }}
          >
            <Section horizontal centerVertical gap={2}>
              {Array.from({ length: option.stars }).map((_, index) => (
                <MaterialCommunityIcons key={`${option.value}-${index}`} name='star' size={16} color={starColor} />
              ))}
            </Section>
            <Text>{selected ? '✓ ' : ''}{option.label}</Text>
          </PlatformPressable>
        );
      })}
    </Section>
  );
}

export default function AddRecipe({ navigation, route }: { navigation: AddRecipeNavigation; route?: AddRecipeRoute }) {
  const { theme } = useThemeMode();
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [timeMinutes, setTimeMinutes] = useState('');
  const [portions, setPortions] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [descriptionMD, setDescriptionMD] = useState('');
  const [steps, setSteps] = useState<StepItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ingredientSections, setIngredientSections] = useState<IngredientSection[]>([]);
  const [originId, setOriginId] = useState('');

  const recipeId = route?.params?.recipeId as string | undefined;
  const bookBookId = route?.params?.bookBookId;
  const bookItemKey = route?.params?.bookItemKey;
  const isEditing = Boolean(recipeId);
  const returnToBookEditor = Boolean(bookBookId);

  useEffect(() => {
    if (!isEditing || !recipeId) return;

    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const recipe = await recipeService.getRecipeById(recipeId);
        if (!mounted) return;

        setTitle(recipe.title || '');
        setTags((recipe.tags || []).join(', '));
        setTimeMinutes(recipe.timeMinutes != null ? String(recipe.timeMinutes) : '');
        setPortions(recipe.portions != null ? String(recipe.portions) : '');
        setDifficulty(recipe.difficulty ?? Difficulty.MEDIUM);
        setDescriptionMD(recipe.descriptionMD || '');
        setOriginId(recipe.bookOriginId ?? '');
        setSteps((recipe.stepsMD || []).map((text, index) => ({
          key: `step-${index}-${Date.now()}`,
          text
        })));
        setIngredientSections(recipe.ingredientSections || []);
      } catch (err) {
        console.error('Failed to load recipe', err);
        Alert.alert('Erro', 'Não foi possível carregar a receita para edição.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => { mounted = false; };
  }, [isEditing, recipeId]);

  const parseTags = (value: string) => {
    return value
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  };

  const addSection = () => {
    setIngredientSections(prev => [...prev, { title: '', ingredients: [''] }]);
  };

  const removeSection = (index: number) => {
    setIngredientSections(prev => prev.filter((_, i) => i !== index));
  };

  const addIngredient = (sectionIndex: number) => {
    setIngredientSections(prev => prev.map((s, i) => i === sectionIndex ? { ...s, ingredients: [...s.ingredients, ''] } : s));
  };

  const removeIngredient = (sectionIndex: number, ingredientIndex: number) => {
    setIngredientSections(prev => prev.map((s, i) => {
      if (i !== sectionIndex) return s;
      return { ...s, ingredients: s.ingredients.filter((_, j) => j !== ingredientIndex) };
    }));
  };

  const updateSectionTitle = (sectionIndex: number, value: string) => {
    setIngredientSections(prev => prev.map((s, i) => i === sectionIndex ? { ...s, title: value } : s));
  };

  const updateIngredientText = (sectionIndex: number, ingredientIndex: number, value: string) => {
    setIngredientSections(prev => prev.map((s, i) => {
      if (i !== sectionIndex) return s;
      const ingredients = s.ingredients.map((ing, j) => (j === ingredientIndex ? value : ing));
      return { ...s, ingredients };
    }));
  };

  const addStep = () => {
    setSteps(prev => [...prev, { key: createStepKey(), text: '' }]);
  };

  const removeStep = (index: number) => {
    setSteps(prev => prev.filter((_, i) => i !== index));
  };

  const updateStepText = (index: number, value: string) => {
    setSteps(prev => prev.map((step, i) => (i === index ? { ...step, text: value } : step)));
  };

  const moveStep = (index: number, direction: number) => {
    setSteps(prev => {
      const copy = [...prev];
      const to = index + direction;
      if (to < 0 || to >= copy.length) return prev;
      const [item] = copy.splice(index, 1);
      copy.splice(to, 0, item);
      return copy;
    });
  };

  const moveSection = (index: number, direction: number) => {
    setIngredientSections(prev => {
      const copy = [...prev];
      const to = index + direction;
      if (to < 0 || to >= copy.length) return prev;
      const [item] = copy.splice(index, 1);
      copy.splice(to, 0, item);
      return copy;
    });
  };

  const moveIngredient = (sectionIndex: number, ingredientIndex: number, direction: number) => {
    setIngredientSections(prev => prev.map((s, i) => {
      if (i !== sectionIndex) return s;
      const copy = [...s.ingredients];
      const to = ingredientIndex + direction;
      if (to < 0 || to >= copy.length) return s;
      const [item] = copy.splice(ingredientIndex, 1);
      copy.splice(to, 0, item);
      return { ...s, ingredients: copy };
    }));
  };

  const updateIngredientsOrder = (sectionIndex: number, newIngredients: string[]) => {
    setIngredientSections(prev => prev.map((s, i) => i === sectionIndex ? { ...s, ingredients: newIngredients } : s));
  };

  const handleSubmit = async () => {
    if (!title) {
      Alert.alert('Título necessário', 'Por favor informe um título para a receita.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        id: recipeId ?? '',
        authorId: '',
        bookOriginId: bookBookId ?? originId,
        title,
        tags: parseTags(tags),
        difficulty,
        timeMinutes: Number(timeMinutes) || 0,
        portions: Number(portions) || 1,
        descriptionMD,
        ingredientSections,
        stepsMD: steps.map((step) => step.text.trim()).filter((text) => text.length > 0),
        images: [],
        isPublic: true,
        rating: 0,
        createdAt: null,
        updatedAt: null
      } as Recipe;

      if (isEditing && recipeId) {
        const updated = await recipeService.updateRecipe(recipeId, payload);
        if (returnToBookEditor) {
          setPendingRecipeReturn({
            bookId: bookBookId,
            recipeId: updated.id,
            recipeTitle: updated.title,
            recipeKey: bookItemKey
          });
          (navigation as any).goBack();
        } else {
          (navigation as any).goBack();
        }
      } else {
        const created = await recipeService.createRecipe(payload);
        if (returnToBookEditor) {
          setPendingRecipeReturn({
            bookId: bookBookId,
            recipeId: created.id,
            recipeTitle: created.title,
            recipeKey: bookItemKey
          });
          (navigation as any).goBack();
        } else {
          (navigation as any).navigate('ReadRecipe', { recipeId: created.id });
        }
      }
    } catch (err) {
      console.error('Failed to save recipe', err);
      Alert.alert('Erro', isEditing ? 'Não foi possível atualizar a receita.' : 'Não foi possível criar a receita.');
    } finally {
      setSaving(false);
    }
  };

  const ScreenWrapper: any = Platform.OS === 'web' ? SimpleScreen : NestableScrollContainer;
  const useDragAndDrop = Platform.OS !== 'web';

  return (
    <ScreenWrapper
      style={Platform.OS === 'web' ? undefined : globalStyles(theme).screen}
      contentContainerStyle={Platform.OS === 'web' ? undefined : { paddingBottom: 40, gap: 15 }}
      scrollPadding={Platform.OS === 'web' ? true : undefined}
      keyboardShouldPersistTaps='handled'
    >
      <TitleWithBackButton navigation={navigation}>{isEditing ? 'Editar receita' : 'Adicionar receita'}</TitleWithBackButton>

      <Section gap={10}>
        <Header>Título</Header>
        <Input placeholder='Título' value={title} onChangeText={setTitle} />

        <Header>Tags (separadas por vírgula)</Header>
        <Input placeholder='ex: sobremesa, vegano' value={tags} onChangeText={setTags} />

        <Section horizontal gap={10}>
          <Section style={{ flex: 1 }}>
            <Header>Tempo (min)</Header>
            <Input placeholder='30' value={timeMinutes} onChangeText={setTimeMinutes} keyboardType='numeric' />
          </Section>

          <Section style={{ flex: 1 }}>
            <Header>Porções</Header>
            <Input placeholder='4' value={portions} onChangeText={setPortions} keyboardType='numeric' />
          </Section>
        </Section>

        <Header>Dificuldade</Header>
        <DifficultyPicker difficulty={difficulty} onChange={setDifficulty} />

        <Header>Descrição (Markdown)</Header>
        <Input placeholder='Breve descrição' value={descriptionMD} onChangeText={setDescriptionMD} big multiline autoGrow minHeight={110} />

        <Header>Modo de preparo (adicione, remova e reordene os passos)</Header>
        <Section gap={10}>
          {steps.length === 0 ? (
            <SlimSimpleButton onPress={addStep}>Adicionar passo</SlimSimpleButton>
          ) : (
            useDragAndDrop ? (
              <Draggable
                data={steps}
                keyExtractor={(item: StepItem) => item.key}
                onDragEnd={(params: { data: StepItem[] }) => setSteps(params.data)}
                renderItem={({ item, index, drag }: { item: StepItem; index: number; drag: () => void }) => (
                  <StepRow
                    step={item}
                    index={index}
                    onChange={(value) => updateStepText(index, value)}
                    onRemove={() => removeStep(index)}
                    drag={drag}
                  />
                )}
              />
            ) : (
              <Section gap={10}>
                {steps.map((step, index) => (
                  <StepRow
                    key={step.key}
                    step={step}
                    index={index}
                    onChange={(value) => updateStepText(index, value)}
                    onRemove={() => removeStep(index)}
                    onMoveUp={index > 0 ? () => moveStep(index, -1) : undefined}
                    onMoveDown={index < steps.length - 1 ? () => moveStep(index, 1) : undefined}
                    showDragHandle={false}
                  />
                ))}
              </Section>
            )
          )}

          <SlimSimpleButton onPress={addStep}>+ Passo</SlimSimpleButton>
        </Section>

        <Header>Ingredientes</Header>

        {loading ? (
          <ActivityIndicator color='#fff' />
        ) : ingredientSections.length === 0 ? (
          <SlimSimpleButton onPress={addSection}>Adicionar seção de ingredientes</SlimSimpleButton>
        ) : (
          useDragAndDrop ? (
            <Draggable
              data={ingredientSections}
              keyExtractor={(item: any, index: number) => `section-${index}`}
              onDragEnd={(params: any) => setIngredientSections(params.data)}
              renderItem={({ item: section, index: sectionIndex, drag }: any) => (
                <Section key={`section-${sectionIndex}`} gap={10}>
                  <Section horizontal gap={10}>
                    <Input
                      placeholder='Título da seção (opcional)'
                      value={section.title}
                      onChangeText={(v) => updateSectionTitle(sectionIndex, v)}
                      multiline
                      autoGrow
                      minHeight={52}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <PlatformPressable onLongPress={drag}>
                        <MaterialCommunityIcons name='drag' size={20} style={{ color: globalColors(theme).subtext, marginHorizontal: 6 }} />
                      </PlatformPressable>
                      <PlatformPressable onPress={() => removeSection(sectionIndex)}>
                        <MaterialCommunityIcons name='trash-can-outline' size={24} style={{ color: globalColors(theme).subtext, marginLeft: 6 }} />
                      </PlatformPressable>
                    </View>
                  </Section>

                  <Section gap={8}>
                    {section.ingredients.map((ingredient: string, ingredientIndex: number) => (
                      <Section key={`ing-${sectionIndex}-${ingredientIndex}`} horizontal gap={8} centerVertical>
                        <Input
                          style={{ flex: 1 }}
                          placeholder='Ingrediente'
                          value={ingredient}
                          onChangeText={(v) => updateIngredientText(sectionIndex, ingredientIndex, v)}
                          multiline
                          autoGrow
                          minHeight={52}
                        />
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <PlatformPressable onPress={() => moveIngredient(sectionIndex, ingredientIndex, -1)} disabled={ingredientIndex === 0}>
                            <MaterialCommunityIcons name='chevron-up' size={18} style={{ color: globalColors(theme).subtext, marginHorizontal: 6 }} />
                          </PlatformPressable>
                          <PlatformPressable onPress={() => moveIngredient(sectionIndex, ingredientIndex, 1)} disabled={ingredientIndex === section.ingredients.length - 1}>
                            <MaterialCommunityIcons name='chevron-down' size={18} style={{ color: globalColors(theme).subtext, marginHorizontal: 6 }} />
                          </PlatformPressable>
                          <PlatformPressable onPress={() => removeIngredient(sectionIndex, ingredientIndex)}>
                            <MaterialCommunityIcons name='close' size={20} style={{ color: globalColors(theme).subtext }} />
                          </PlatformPressable>
                        </View>
                      </Section>
                    ))}

                    <SlimSimpleButton onPress={() => addIngredient(sectionIndex)}>+ Ingrediente</SlimSimpleButton>
                  </Section>
                </Section>
              )}
            />
          ) : (
            <Section gap={10}>
              {ingredientSections.map((section, sectionIndex) => (
                <Section key={`section-${sectionIndex}`} gap={10}>
                  <Section horizontal gap={10}>
                    <Input
                      placeholder='Título da seção (opcional)'
                      value={section.title}
                      onChangeText={(v) => updateSectionTitle(sectionIndex, v)}
                      multiline
                      autoGrow
                      minHeight={52}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <PlatformPressable onPress={() => moveSection(sectionIndex, -1)} disabled={sectionIndex === 0}>
                        <MaterialCommunityIcons name='chevron-up' size={18} style={{ color: globalColors(theme).subtext, marginHorizontal: 6 }} />
                      </PlatformPressable>
                      <PlatformPressable onPress={() => moveSection(sectionIndex, 1)} disabled={sectionIndex === ingredientSections.length - 1}>
                        <MaterialCommunityIcons name='chevron-down' size={18} style={{ color: globalColors(theme).subtext, marginHorizontal: 6 }} />
                      </PlatformPressable>
                      <PlatformPressable onPress={() => removeSection(sectionIndex)}>
                        <MaterialCommunityIcons name='trash-can-outline' size={24} style={{ color: globalColors(theme).subtext, marginLeft: 6 }} />
                      </PlatformPressable>
                    </View>
                  </Section>

                  <Section gap={8}>
                    {section.ingredients.map((ingredient: string, ingredientIndex: number) => (
                      <Section key={`ing-${sectionIndex}-${ingredientIndex}`} horizontal gap={8} centerVertical>
                        <Input
                          style={{ flex: 1 }}
                          placeholder='Ingrediente'
                          value={ingredient}
                          onChangeText={(v) => updateIngredientText(sectionIndex, ingredientIndex, v)}
                          multiline
                          autoGrow
                          minHeight={52}
                        />
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <PlatformPressable onPress={() => moveIngredient(sectionIndex, ingredientIndex, -1)} disabled={ingredientIndex === 0}>
                            <MaterialCommunityIcons name='chevron-up' size={18} style={{ color: globalColors(theme).subtext, marginHorizontal: 6 }} />
                          </PlatformPressable>
                          <PlatformPressable onPress={() => moveIngredient(sectionIndex, ingredientIndex, 1)} disabled={ingredientIndex === section.ingredients.length - 1}>
                            <MaterialCommunityIcons name='chevron-down' size={18} style={{ color: globalColors(theme).subtext, marginHorizontal: 6 }} />
                          </PlatformPressable>
                          <PlatformPressable onPress={() => removeIngredient(sectionIndex, ingredientIndex)}>
                            <MaterialCommunityIcons name='close' size={20} style={{ color: globalColors(theme).subtext }} />
                          </PlatformPressable>
                        </View>
                      </Section>
                    ))}

                    <SlimSimpleButton onPress={() => addIngredient(sectionIndex)}>+ Ingrediente</SlimSimpleButton>
                  </Section>
                </Section>
              ))}
            </Section>
          )
        )}

        <Section>
          {saving ? (
            <ActivityIndicator color='#fff' />
          ) : (
            <BigAccentButton onPress={handleSubmit}>{isEditing ? 'Atualizar receita' : 'Salvar receita'}</BigAccentButton>
          )}
        </Section>
      </Section>
    </ScreenWrapper>
  );
}
