import { useState, useRef } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

import Button from '../components/Button';

import { AppDispatch, RootState } from '../redux/store';
import { registerUser } from '../redux/slices/authSlice';

import { colors } from '../utils/colors';
import { validateEmail } from '../utils/helpers';

const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const handleRegister = () => {
    if (!email || !password || !confirmPassword) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (password.length < 3) {
      setErrorMessage('Password must be at least 3 characters');
      return;
    }

    setErrorMessage('');

    dispatch(registerUser({ email, password }));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.textOnDark}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />
      <TextInput
        ref={passwordRef}
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.textOnDark}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        returnKeyType="next"
        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
      />
      <TextInput
        ref={confirmPasswordRef}
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor={colors.textOnDark}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        returnKeyType="done"
        onSubmitEditing={handleRegister}
      />
      {errorMessage || error ? (
        <Text style={styles.errorText}>{errorMessage || error}</Text>
      ) : null}
      <Button
        onPress={handleRegister}
        style="primary"
        label="Register"
        isLoading={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
    padding: 32,
    gap: 12
  },
  input: {
    backgroundColor: colors.inputBackground,
    color: colors.primaryText,
    padding: 12,
    borderRadius: 8
  },
  errorText: {
    color: colors.errorColor,
    textAlign: 'center'
  }
});

export default RegisterScreen;
