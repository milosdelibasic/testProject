import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import { colors } from '../utils/colors';

interface Props {
  label: string;
  onPress: (e: GestureResponderEvent) => void;
  disabled?: boolean;
  isLoading?: boolean;
  style: 'primary' | 'secondary' | 'tertiary';
}

const Button: React.FC<Props> = ({
  label,
  onPress,
  disabled,
  isLoading,
  style
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[
        styles.container,
        style == 'primary' && styles.primary,
        style == 'secondary' && styles.secondary,
        style == 'tertiary' && styles.tertiary
      ]}>
      {isLoading ? (
        <ActivityIndicator size="small" color="blue" />
      ) : (
        <Text
          style={[
            style != 'tertiary' ? styles.textColor : styles.textColorTertiary
          ]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  primary: {
    backgroundColor: colors.primaryButtonBackground
  },
  secondary: {
    backgroundColor: colors.secondaryBackground
  },
  tertiary: {
    paddingHorizontal: 10
  },
  textColor: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: 500
  },
  textColorTertiary: {
    color: colors.accentColor,
    fontSize: 16,
    fontWeight: 500
  }
});

export default Button;
