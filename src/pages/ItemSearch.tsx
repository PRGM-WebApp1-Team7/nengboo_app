import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {WebView} from 'react-native-webview';
import {LOCAL_URL, HOSTING_URL} from '@env';
import {getData} from '../utils/asyncstorage';

const ItemSearch = ({route}) => {
  const [refrige, setRefrige] = useState('');
  const [user, setUser] = useState('');
  useEffect(() => {
    const init = async () => {
      const data = await getData();
      setUser(data.user_id);
      setRefrige(data.refrige_id);
    };
    init();
  }, []);
  const {searchTerm} = route.params;

  const handleOnMessage = event => {
    const {message} = JSON.parse(event.nativeEvent.data);
    console.log(message);
  };
  return (
    <SafeAreaView className={`flex flex-1`}>
      <WebView
        source={{
          uri:
            __DEV__ === true
              ? `${LOCAL_URL}/itemSearch?product_id=${searchTerm}&refrige_id=${refrige}&user_id=${user}`
              : `${HOSTING_URL}/itemSearch?product_id=${searchTerm}&refrige_id=${refrige}&user_id=${user}`,
        }}
        onMessage={handleOnMessage}
      />
    </SafeAreaView>
  );
};

export default ItemSearch;
