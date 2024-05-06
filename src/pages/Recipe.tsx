import React from 'react';
import {WebView} from 'react-native-webview';

const Recipe = () => {
  return (
    <WebView
      source={{uri: 'http://localhost:3000/recipe'}}
      className={`flex flex-1`}
    />
  );
};

export default Recipe;
