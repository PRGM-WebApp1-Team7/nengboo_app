import React from 'react';
import {WebView} from 'react-native-webview';

const Badge = () => {
  return (
    <WebView
      source={{uri: 'http://localhost:3000/badge'}}
      className={`flex flex-1`}
    />
  );
};

export default Badge;
