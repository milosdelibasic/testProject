import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';

import RootStack from './src/screens/RootStack';
import { store } from './src/redux/store';

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <RootStack />
      </Provider>
    </NavigationContainer>
  );
};

export default App;
