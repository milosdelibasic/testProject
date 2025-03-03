import { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TextInputProps
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

import Button from '../components/Button';

import { AppDispatch, RootState } from '../redux/store';
import { loginUser } from '../redux/slices/authSlice';

import { colors } from '../utils/colors';
import { validateEmail } from '../utils/helpers';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const passwordRef = useRef<TextInput>(null);

  const handleLogin = () => {
    if (!email || !password) {
      setErrorMessage('Please fill in both fields');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email');
      return;
    }

    if (password.length < 3) {
      setErrorMessage('Password must be at least 3 characters');
      return;
    }

    setErrorMessage('');

    dispatch(loginUser({ email, password }));
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
        returnKeyType="done"
        onSubmitEditing={handleLogin}
      />
      {errorMessage || error ? (
        <Text style={styles.errorText}>{errorMessage || error}</Text>
      ) : null}
      <Button
        onPress={handleLogin}
        style="primary"
        label="Login"
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

export default LoginScreen;
