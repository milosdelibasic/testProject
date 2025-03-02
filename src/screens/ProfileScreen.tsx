import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';

import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../components/Button';

import { RootStackParamList, screens } from '../utils/screens';
import { AppDispatch, RootState } from '../redux/store';
import { logout } from '../redux/slices/authSlice';

import { colors } from '../utils/colors';

const BASE_URL = 'https://reqres.in/api';

const ProfileScreen: React.FC = () => {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const { user, loadingUserInfo } = useSelector(
    (state: RootState) => state.auth
  );

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();

  const navigateToEditProfile = () => {
    navigation.navigate(screens.editProfileScreen);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleteLoading(true);
              await axios.delete(`${BASE_URL}/users/${user?.id}`);

              Alert.alert('Success', 'Account successfully deleted.');
              dispatch(logout());
            } catch (error) {
              console.error('Delete account failed:', error);
              Alert.alert(
                'Error',
                'Failed to delete account. Please try again.'
              );
            } finally {
              setIsDeleteLoading(false);
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      {loadingUserInfo ? (
        <ActivityIndicator size="large" color="white" />
      ) : (
        <View style={styles.profileContainer}>
          <Image source={{ uri: user?.avatar }} style={styles.profileImage} />
          <Text style={styles.name}>
            {user?.first_name} {user?.last_name}
          </Text>
          <Text style={styles.email}>{user?.email}</Text>
          {user?.id && <Text style={styles.userId}>ID: {user.id}</Text>}
        </View>
      )}

      <View style={styles.bottom}>
        <Button
          onPress={navigateToEditProfile}
          style="primary"
          label="Edit Profile"
          disabled={isDeleteLoading}
        />
        <Button
          onPress={handleLogout}
          style="secondary"
          label="Sign out"
          disabled={isDeleteLoading}
        />
        <Button
          onPress={handleDeleteAccount}
          style="tertiary"
          label="Delete account"
          disabled={isDeleteLoading}
          isLoading={isDeleteLoading}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  profileContainer: {
    alignItems: 'center',
    gap: 6
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.accentColor,
    borderColor: colors.accentColor,
    borderWidth: 3,
    marginBottom: 10
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primaryText
  },
  email: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textOnDark
  },
  userId: {
    fontSize: 16,
    color: colors.secondaryText,
    marginTop: 4
  },
  bottom: {
    width: '100%',
    gap: 20
  }
});

export default ProfileScreen;
