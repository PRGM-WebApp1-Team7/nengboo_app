import React from 'react';
import {SafeAreaView} from 'react-native';
import {WebView} from 'react-native-webview';
import {LOCAL_URL, HOSTING_URL} from '@env';

const Refrigerator = () => {
  return (
    <SafeAreaView className={`flex flex-1`}>
      <WebView
        source={{
          uri: __DEV__ === true ? `${LOCAL_URL}/main` : `${HOSTING_URL}/main`,
        }}
      />
    </SafeAreaView>
  );
};

export default Refrigerator;
