import { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './HomeScreen';
import AuthScreen from './AuthScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import ProfileScreen from './ProfileScreen';
import EditProfileScreen from './EditProfileScreen';

import { RootStackParamList, screens } from '../utils/screens';
import { AppDispatch, RootState } from '../redux/store';
import { loginUser } from '../redux/slices/authSlice';

import { colors } from '../utils/colors';

import userIcon from '../../assets/icons/user.png';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStack: React.FC = () => {
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    //Auto login for cached users, in reality we would show splash screen until this part finishes
    const loadStoredData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userData = await AsyncStorage.getItem('user');

        if (token && userData) {
          const user = JSON.parse(userData);
          dispatch(loginUser({ email: user.email, password: 'dummyPassword' }));
        }
      } catch (error) {
        console.log('Error loading cached data', error);
      } finally {
        setLoading(false);
        //hide splash screen
      }
    };

    loadStoredData();
  }, []);

  if (loading) return null;

  if (user) {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primaryBackground
          },
          headerTitleStyle: {
            color: colors.primaryText,
            fontSize: 20,
            fontWeight: 'bold'
          },
          headerTintColor: colors.primaryText
        }}>
        <Stack.Screen
          name={screens.homeScreen}
          component={HomeScreen}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate(screens.profileScreen)}>
                <Image source={userIcon} style={styles.profileImage} />
              </TouchableOpacity>
            )
          })}
        />
        <Stack.Screen name={screens.profileScreen} component={ProfileScreen} />
        <Stack.Screen
          name={screens.editProfileScreen}
          component={EditProfileScreen}
        />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primaryBackground
        },
        headerTitleStyle: {
          color: colors.primaryText,
          fontSize: 20,
          fontWeight: 'bold'
        },
        headerTintColor: colors.primaryText
      }}>
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

const styles = StyleSheet.create({
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 16
  }
});

export default RootStack;
