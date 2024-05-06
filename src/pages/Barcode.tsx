import React from 'react';
import {WebView} from 'react-native-webview';

const Barcode = () => {
  return (
    <WebView
      source={{uri: 'http://localhost:3000/barcode'}}
      className={`flex flex-1`}
    />
  );
};

export default Barcode;
