import React, {useEffect} from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import Router from './src/Router.tsx';

function App(): React.JSX.Element {
  useEffect(() => {
    if (__DEV__) {
      import('./ReactotronConfig').then(() =>
        console.log('Reactotron Configured'),
      );
    }
  }, []); // Reactotron 연결

  return (
    <NavigationContainer>
      <Router />
    </NavigationContainer>
  );
}
export default App;
