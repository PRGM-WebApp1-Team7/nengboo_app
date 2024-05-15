import React from 'react';
import {SafeAreaView} from 'react-native';
import {WebView} from 'react-native-webview';
import {LOCAL_URL, HOSTING_URL} from '@env';

const ItemPost = () => {
  return (
    <SafeAreaView className={`flex flex-1`}>
      <WebView
        source={{
          uri:
            __DEV__ === true
              ? `${LOCAL_URL}/ItemPost`
              : `${HOSTING_URL}/ItemPost`,
        }}
      />
    </SafeAreaView>
  );
};

export default ItemPost;
