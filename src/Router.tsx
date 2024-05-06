import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Refrigerator from './pages/Refrigerator.tsx';
import CustomBottomTab from './components/CustomBottomTab';
import Recipe from './pages/Recipe.tsx';
import Barcode from './pages/Barcode.tsx';
import Badge from './pages/Badge.tsx';
import Login from './pages/Login.tsx';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const renderTabBar = props => <CustomBottomTab {...props} />;

const MainTab = () => {
  return (
    <Tab.Navigator
      tabBar={renderTabBar}
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen name="냉장고" component={Refrigerator} />
      <Tab.Screen name="스캔" component={Barcode} />
      <Tab.Screen name="레시피 추천" component={Recipe} />
      <Tab.Screen name="배지" component={Badge} />
    </Tab.Navigator>
  );
};

const Router = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="MainTab" component={MainTab} />
    </Stack.Navigator>
  );
};
export default Router;
