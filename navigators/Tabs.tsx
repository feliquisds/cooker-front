import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabBar } from '../components/TabBar';

import Summary from '../screens/Home';
import Reports from '../screens/Saved';
import Notifications from '../screens/Search';
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
            <Tab.Screen name='Home' component={Summary} options={{ title: 'Início' }} />
            <Tab.Screen name='Saved' component={Reports} options={{ title: 'Salvo' }} />
            <Tab.Screen name='Search' component={Notifications} options={{ title: 'Buscar' }} />
            <Tab.Screen name='Profile' component={Profile} options={{ title: 'Perfil' }} />
        </Tab.Navigator>
    );
}