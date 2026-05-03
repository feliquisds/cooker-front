import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabBar } from '../components/TabBar';

import Home from '../screens/Home';
import Saved from '../screens/Saved';
import Search from '../screens/Search';
import Profile from '../screens/Profile';

export type RootTabParamList = {
    Home: undefined;
    Saved: undefined;
    Search: undefined;
    Profile: undefined;
};

export const Tab = createBottomTabNavigator<RootTabParamList>();

export default function TabsNavigator() {
    return (
        <Tab.Navigator
            initialRouteName='Home'
            tabBar={(props) => <TabBar {...props} />}
            screenOptions={{
                headerShown: false
            }}
        >
            <Tab.Screen name='Home' component={Home} options={{ title: 'Início' }} />
            <Tab.Screen name='Saved' component={Saved} options={{ title: 'Salvo' }} />
            <Tab.Screen name='Search' component={Search} options={{ title: 'Buscar' }} />
            <Tab.Screen name='Profile' component={Profile} options={{ title: 'Perfil' }} />
        </Tab.Navigator>
    );
}