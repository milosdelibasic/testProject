import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import Button from '../components/Button';

import { colors } from '../utils/colors';
import { validateEmail, validatePassword } from '../utils/helpers';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      setErrorMessage('Please fill in both fields');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email');
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage(
        'Password must be at least 8 characters, contain one uppercase letter, one lowercase letter, and one symbol.'
      );
      return;
    }

    setErrorMessage('');

    //TODO API CALL
    console.log('Form is valid, ready for API call');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.textOnDark}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.textOnDark}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <Button onPress={handleLogin} style="primary" label="Login" />
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
