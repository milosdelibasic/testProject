import { useState, useRef, useLayoutEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Alert } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../components/Button';

import { updateUserProfile } from '../redux/slices/authSlice';
import { RootStackParamList } from '../utils/screens';
import { AppDispatch, RootState } from '../redux/store';

import { colors } from '../utils/colors';
import { validateEmail } from '../utils/helpers';

const EditProfileScreen: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);

  useLayoutEffect(() => {
    navigation.setOptions({ title: 'Edit Profile' });
  }, [navigation]);

  const handleSave = async () => {
    setErrorMessage('');

    if (firstName === '' || lastName === '' || email === '') {
      setErrorMessage('All fields are required!');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email');
      return;
    }

    try {
      setIsLoading(true);

      await dispatch(
        updateUserProfile({
          id: user?.id || 1,
          first_name: firstName,
          last_name: lastName,
          email
        })
      ).unwrap();

      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    } catch (error: any) {
      console.error('Update failed:', error);
      setErrorMessage('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <View>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Enter your first name"
          placeholderTextColor={colors.secondaryText}
          returnKeyType="next"
          onSubmitEditing={() => lastNameRef.current?.focus()}
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          ref={lastNameRef}
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Enter your last name"
          placeholderTextColor={colors.secondaryText}
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          ref={emailRef}
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          placeholderTextColor={colors.secondaryText}
          returnKeyType="done"
          onSubmitEditing={handleSave}
        />

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
      </View>

      <Button
        onPress={handleSave}
        style="primary"
        label="Save Changes"
        isLoading={isLoading}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
    paddingHorizontal: 16,
    paddingVertical: 16
  },
  label: {
    fontSize: 16,
    color: colors.primaryText,
    marginBottom: 8,
    fontWeight: 'bold'
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingLeft: 10,
    marginBottom: 16,
    borderRadius: 8,
    fontSize: 16,
    color: colors.primaryText
  },
  errorText: {
    color: colors.errorColor,
    textAlign: 'center',
    marginBottom: 16
  }
});

export default EditProfileScreen;
