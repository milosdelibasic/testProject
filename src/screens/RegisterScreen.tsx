import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import Button from '../components/Button';

import { colors } from '../utils/colors';
import { validateEmail, validatePassword } from '../utils/helpers';

const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

    if (!validatePassword(password)) {
      setErrorMessage(
        'Password must be at least 8 characters, contain one uppercase letter, one lowercase letter, and one symbol.'
      );
      return;
    }

    setErrorMessage('');

    //TODO API CALL for registration
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
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor={colors.textOnDark}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <Button onPress={handleRegister} style="primary" label="Register" />
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
