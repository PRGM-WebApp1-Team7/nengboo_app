import React from 'react';
import {WebView} from 'react-native-webview';
import {LOCAL_URL, HOSTING_URL} from '@env';

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
      source={{uri: __DEV__ === true ? LOCAL_URL : HOSTING_URL}}
      onMessage={handleOnMessage}
      className={`flex flex-1`}
    />
  );
};

export default Login;
