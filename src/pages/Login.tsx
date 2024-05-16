import React from 'react';
import {WebView} from 'react-native-webview';
import {LOCAL_URL, HOSTING_URL} from '@env';
import {storeData} from '../utils/asyncstorage';

const Login = ({navigation}) => {
  const handleOnMessage = async e => {
    const {message} = JSON.parse(e.nativeEvent.data);
    const data = JSON.parse(message);
    if (!!data) {
      await storeData(data);
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
