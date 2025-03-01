import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import RootStack from './src/screens/RootStack';

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
};

export default App;
