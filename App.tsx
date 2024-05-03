
import React, {useEffect} from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import Router from './src/Router.tsx';
import SplashScreen from 'react-native-splash-screen';

function App(): React.JSX.Element {
  useEffect(() => {
  if (__DEV__) {
        import('./ReactotronConfig').then(() =>
          console.log('Reactotron Configured'),
        );

      setTimeout(() => {
            SplashScreen.hide();
          }, 1000);
    }

  }, []); // Reactotron 연결

  return (
    <NavigationContainer>
      <Router />
    </NavigationContainer>
  );
}
export default App;
