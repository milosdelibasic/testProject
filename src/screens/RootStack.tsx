import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './HomeScreen';
import AuthScreen from './AuthScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import ProfileScreen from './ProfileScreen';

import { screens } from '../utils/screens';

const Stack = createNativeStackNavigator();

const RootStack: React.FC = () => {
  const isLoggedIn = false;

  if (isLoggedIn) {
    return (
      <Stack.Navigator>
        <Stack.Screen name={screens.homeScreen} component={HomeScreen} />
        <Stack.Screen name={screens.profileScreen} component={ProfileScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={screens.authScreen}
        component={AuthScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={screens.loginScreen} component={LoginScreen} />
      <Stack.Screen name={screens.registerScreen} component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default RootStack;
