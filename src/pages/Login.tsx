import React from 'react';
import {WebView} from 'react-native-webview';

const Login = ({navigation}) => {
  const handleOnMessage = e => {
    const {message} = JSON.parse(e.nativeEvent.data);
    console.log(message);
    if (message === 'login') {
      navigation.navigate('MainTab');
    }
  };

  return (
    <WebView
      source={{uri: 'http://localhost:3000'}}
      onMessage={handleOnMessage}
      className={`flex flex-1`}
    />
  );
};

export default Login;
