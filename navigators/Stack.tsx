import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import globalStyles from '../styles/Styles';
import { useThemeMode } from '../components/ThemeProvider';

import Tabs from './Tabs';
import Login from '../screens/Login';
import Recovery from '../screens/Recovery';
import Search from '../screens/Search';
import Profile from '../screens/Profile';
import Saved from '../screens/Saved';
import Home from '../screens/Home';

type RootStackParamList = {
    Tabs: undefined;
    Login: undefined;
    Recovery: undefined;
    Home: undefined;
    Saved: undefined;
    Search: undefined;
    Profile: undefined;
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
                        <Stack.Screen name='Login' component={Login} />
                        <Stack.Screen name='Recovery' component={Recovery} />
                        <Stack.Screen name='Home' component={Home} />
                        <Stack.Screen name='Saved' component={Saved} />
                        <Stack.Screen name='Search' component={Search} />
                        <Stack.Screen name='Profile' component={Profile} />
                    </Stack.Navigator>
                </NavigationContainer>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}