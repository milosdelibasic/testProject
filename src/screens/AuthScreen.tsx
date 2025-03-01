import { StyleSheet, Text, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Button from '../components/Button';

import { colors } from '../utils/colors';
import { RootStackParamList, screens } from '../utils/screens';

const AuthScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const navigateToLoginScreen = () => {
    navigation.navigate(screens.loginScreen);
  };

  const navigateToRegisterScreen = () => {
    navigation.navigate(screens.registerScreen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Test Project :)</Text>
      <View style={styles.middle}>
        <Button label="Login" style="primary" onPress={navigateToLoginScreen} />
        <View style={styles.row}>
          <Text style={styles.text}>Don't have an account?</Text>
          <Button
            label="Sign Up"
            style="tertiary"
            onPress={navigateToRegisterScreen}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
    alignItems: 'center',
    paddingVertical: 32
  },
  middle: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 20
  },
  title: {
    color: colors.primaryText,
    fontSize: 30,
    fontWeight: 600
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    color: colors.textOnDark,
    fontSize: 16
  }
});

export default AuthScreen;
