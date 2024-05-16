import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {WebView} from 'react-native-webview';
import {LOCAL_URL, HOSTING_URL} from '@env';
import {getData} from '../utils/asyncstorage';
const Recipe = () => {
  const [refrige, setRefrige] = useState('');
  useEffect(() => {
    const init = async () => {
      const data = await getData();
      console.log('data', data);
      setRefrige(data.refrige_id);
    };
    init();
  }, []);
  const handleOnMessage = event => {
    const {message} = JSON.parse(event.nativeEvent.data);
    console.log(message);
  };
  return (
    <SafeAreaView className={`flex flex-1`}>
      {!!refrige ? (
        <WebView
          source={{
            uri:
              __DEV__ === true
                ? `${LOCAL_URL}/recipe?refrige_id=${refrige}`
                : `${HOSTING_URL}/recipe?refrige_id=${refrige}`,
          }}
          onMessage={handleOnMessage}
        />
      ) : (
        <></>
      )}
    </SafeAreaView>
  );
};

export default Recipe;
