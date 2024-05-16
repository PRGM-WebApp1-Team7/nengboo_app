import React from 'react';
import {SafeAreaView} from 'react-native';
import {WebView} from 'react-native-webview';
import {LOCAL_URL, HOSTING_URL} from '@env';

const ItemSearch = ({route}) => {
  const {searchTerm} = route.params;
  return (
    <SafeAreaView className={`flex flex-1`}>
      <WebView
        source={{
          uri:
            __DEV__ === true
              ? `${LOCAL_URL}/itemSearch?product_id=${searchTerm}`
              : `${HOSTING_URL}/itemSearch?product_id=${searchTerm}`,
        }}
      />
    </SafeAreaView>
  );
};

export default ItemSearch;
