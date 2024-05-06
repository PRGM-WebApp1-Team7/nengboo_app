import React from 'react';
import {WebView} from 'react-native-webview';

const Refrigerator = () => {
  return (
    <WebView
      source={{uri: 'http://localhost:3000/main'}}
      className={`flex flex-1`}
    />
  );
};

export default Refrigerator;
