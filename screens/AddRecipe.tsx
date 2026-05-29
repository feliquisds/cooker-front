import { useState, useEffect } from 'react';
import { Section } from '../components/Alignments';
import { SimpleScreen } from '../components/Interface';
import { Header, Text, TitleWithBackButton } from '../components/Texts';
import { Input } from '../components/Inputs';
import { BigAccentButton, SlimSimpleButton } from '../components/Buttons';
import { useThemeMode } from '../components/ThemeProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Difficulty } from '../model/Difficulty';
import type { IngredientSection } from '../model/IngredientSection';
import type { Ingredient } from '../model/Ingredient';
import RecipeService from '../services/RecipeService';
import { ActivityIndicator, Alert, View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
// Some versions export a generic component type that TypeScript won't accept in JSX directly.
// Cast to `any` and use the alias `Draggable` in JSX to avoid TSX typing errors.
const Draggable: any = DraggableFlatList as any;
import globalColors from '../styles/Colors';
import { PlatformPressable } from '@react-navigation/elements';
import { ScreenNavigation } from '../components/Types';

const recipeService = new RecipeService();

type AddRecipeNavigation = ScreenNavigation<{}> & { goBack: () => void };

export default function AddRecipe({ navigation, route }: { navigation: AddRecipeNavigation; route?: any }) {
  const { theme } = useThemeMode();
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [timeMinutes, setTimeMinutes] = useState('');
  const [portions, setPortions] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [descriptionMD, setDescriptionMD] = useState('');
  const [stepsText, setStepsText] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ingredientSections, setIngredientSections] = useState<IngredientSection[]>([]);

  const recipeId = route?.params?.recipeId as string | undefined;
  const isEditing = Boolean(recipeId);

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
        setStepsText((recipe.stepsMD || []).join('\n'));
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
    setIngredientSections(prev => [...prev, { title: '', ingredients: [{ quantity: 0, unit: '', name: '' }] }]);
  };

  const removeSection = (index: number) => {
    setIngredientSections(prev => prev.filter((_, i) => i !== index));
  };

  const addIngredient = (sectionIndex: number) => {
    setIngredientSections(prev => prev.map((s, i) => i === sectionIndex ? { ...s, ingredients: [...s.ingredients, { quantity: 0, unit: '', name: '' }] } : s));
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

  const updateIngredientField = (sectionIndex: number, ingredientIndex: number, field: keyof Ingredient, value: string) => {
    setIngredientSections(prev => prev.map((s, i) => {
      if (i !== sectionIndex) return s;
      const ingredients = s.ingredients.map((ing, j) => {
        if (j !== ingredientIndex) return ing;
        if (field === 'quantity') {
          const num = Number(value);
          return { ...ing, quantity: Number.isNaN(num) ? 0 : num };
        }
        return { ...ing, [field]: value } as Ingredient;
      });
      return { ...s, ingredients };
    }));
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

  const updateIngredientsOrder = (sectionIndex: number, newIngredients: Ingredient[]) => {
    setIngredientSections(prev => prev.map((s, i) => i === sectionIndex ? { ...s, ingredients: newIngredients } : s));
  };

  const handleSubmit = async () => {
    if (!title) {
      Alert.alert('Título necessário', 'Por favor informe um título para a receita.');
      return;
    }

    setSaving(true);
    try {
      const payload: any = {
        title,
        tags: parseTags(tags),
        difficulty,
        timeMinutes: Number(timeMinutes) || 0,
        portions: Number(portions) || 1,
        descriptionMD,
        ingredientSections,
        stepsMD: stepsText ? stepsText.split('\n').map(s => s.trim()).filter(s => s.length > 0) : [],
        images: [],
        isPublic: true
      };

      if (isEditing && recipeId) {
        const updated = await recipeService.updateRecipe(recipeId, payload);
        (navigation as any).goBack();
      } else {
        const created = await recipeService.createRecipe(payload);
        (navigation as any).navigate('ReadRecipe', { recipeId: created.id });
      }
    } catch (err) {
      console.error('Failed to save recipe', err);
      Alert.alert('Erro', isEditing ? 'Não foi possível atualizar a receita.' : 'Não foi possível criar a receita.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SimpleScreen>
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
        <Section horizontal gap={10}>
          <SlimSimpleButton onPress={() => setDifficulty(Difficulty.EASY)}>
            <Text>{difficulty === Difficulty.EASY ? '✓ ' : ''}Fácil</Text>
          </SlimSimpleButton>
          <SlimSimpleButton onPress={() => setDifficulty(Difficulty.MEDIUM)}>
            <Text>{difficulty === Difficulty.MEDIUM ? '✓ ' : ''}Média</Text>
          </SlimSimpleButton>
          <SlimSimpleButton onPress={() => setDifficulty(Difficulty.HARD)}>
            <Text>{difficulty === Difficulty.HARD ? '✓ ' : ''}Difícil</Text>
          </SlimSimpleButton>
        </Section>

        <Header>Descrição (Markdown)</Header>
        <Input placeholder='Breve descrição' value={descriptionMD} onChangeText={setDescriptionMD} big />

        <Header>Modo de preparo (uma linha por passo)</Header>
        <Input placeholder='1. Faça isso\n2. Depois isso' value={stepsText} onChangeText={setStepsText} big />

        <Header>Ingredientes</Header>

        {loading ? (
          <ActivityIndicator color='#fff' />
        ) : ingredientSections.length === 0 ? (
          <SlimSimpleButton onPress={addSection}>Adicionar seção de ingredientes</SlimSimpleButton>
        ) : (
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
                  {section.ingredients.map((ing: Ingredient, ingredientIndex: number) => (
                    <Section key={`ing-${sectionIndex}-${ingredientIndex}`} horizontal gap={8} centerVertical>
                      <MaterialCommunityIcons name='drag-vertical' size={18} style={{ color: globalColors(theme).subtext, marginRight: 6 }} />
                      <Input
                        style={{ flex: 0.6 }}
                        placeholder='Qtd'
                        value={ing.quantity != null ? String(ing.quantity) : ''}
                        onChangeText={(v) => updateIngredientField(sectionIndex, ingredientIndex, 'quantity', v)}
                        keyboardType='numeric'
                      />
                      <Input
                        style={{ width: 80 }}
                        placeholder='Un'
                        value={ing.unit}
                        onChangeText={(v) => updateIngredientField(sectionIndex, ingredientIndex, 'unit', v)}
                      />
                      <Input
                        style={{ flex: 1 }}
                        placeholder='Nome'
                        value={ing.name}
                        onChangeText={(v) => updateIngredientField(sectionIndex, ingredientIndex, 'name', v)}
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
        )}

        <Section>
          {saving ? (
            <ActivityIndicator color='#fff' />
          ) : (
            <BigAccentButton onPress={handleSubmit}>{isEditing ? 'Atualizar receita' : 'Salvar receita'}</BigAccentButton>
          )}
        </Section>
      </Section>
    </SimpleScreen>
  );
}
