export const screens = {
  authScreen: 'Auth',
  loginScreen: 'Login',
  registerScreen: 'Register',
  homeScreen: 'Home',
  profileScreen: 'Profile',
  editProfileScreen: 'EditProfile'
} as const;

export type Screens = keyof typeof screens;

export type RootStackParamList = {
  Auth: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Profile: undefined;
  EditProfile: undefined;
};
