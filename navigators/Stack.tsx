import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import globalStyles from '../styles/Styles';
import { useThemeMode } from '../components/ThemeProvider';
import Tabs from './Tabs';
import Recovery from '../screens/Recovery';
import Search from '../screens/Search';
import Profile from '../screens/Profile';
import Saved from '../screens/Saved';
import Home from '../screens/Home';
import Favorited from '../screens/Favorited';
import ReadRecipe from '../screens/ReadRecipe';
import ReadRecipeBook from '../screens/ReadRecipeBook';
import ReadText from '../screens/ReadText';
import AddRecipe from '../screens/AddRecipe';

type RootStackParamList = {
    Tabs: undefined;
    Login: undefined;
    Recovery: undefined;
    Home: undefined;
    Saved: undefined;
    Search: undefined;
    Profile: undefined;
    Favorited: undefined;
    ReadRecipe: { recipeId: string };
    ReadRecipeBook: { bookId: string; title: string };
    ReadText: { textId: string };
    AddRecipe: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function StackNavigator() {
    const { theme } = useThemeMode();

    return (
        <SafeAreaProvider>
            <SafeAreaView style={globalStyles().staticArea}>
                <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
                <NavigationContainer>
                    <Stack.Navigator
                        initialRouteName='Tabs'
                        screenOptions={{
                            headerShown: false,
                            animation: 'slide_from_right'
                        }}
                    >
                        <Stack.Screen name='Tabs' component={Tabs} />
                        <Stack.Screen name='Recovery' component={Recovery} />
                        <Stack.Screen name='Home' component={Home} />
                        <Stack.Screen name='Saved' component={Saved} />
                        <Stack.Screen name='Search' component={Search} />
                        <Stack.Screen name='Profile' component={Profile} />
                        <Stack.Screen name='Favorited' component={Favorited} />
                        <Stack.Screen
                            name='ReadRecipeBook'
                            children={({ navigation, route }) => (
                                <ReadRecipeBook
                                    navigation={navigation as any}
                                    bookId={(route as any)?.params?.bookId}
                                    title={(route as any)?.params?.title}
                                />
                            )}
                        />
                        <Stack.Screen name='ReadRecipe'
                            children={({ navigation, route }) => (
                                <ReadRecipe navigation={navigation as any} recipeId={(route as any)?.params?.recipeId} />
                            )}
                        />
                        <Stack.Screen name='AddRecipe' component={AddRecipe} />
                        <Stack.Screen name='ReadText'
                            children={({ navigation, route }) => (
                                <ReadText navigation={navigation as any} textId={(route as any)?.params?.textId} />
                            )}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}