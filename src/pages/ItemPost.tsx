import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {WebView} from 'react-native-webview';
import {LOCAL_URL, HOSTING_URL} from '@env';
import {RouteProp} from '@react-navigation/native';
import type {RootStackParamList} from '../Router';
import {getData} from '../utils/asyncstorage';

type ItemPostRouteProp = RouteProp<RootStackParamList, 'ItemDetail'>;

type Props = {
  route: ItemPostRouteProp;
};

const ItemPost: React.FC<Props> = ({route}) => {
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
  const {product_id} = route.params;

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
              ? `${LOCAL_URL}/itemPost??product_id=${product_id}?refrige_id=${refrige}&user_id=${user}`
              : `${HOSTING_URL}/itemPost??product_id=${product_id}?refrige_id=${refrige}&user_id=${user}`,
        }}
        onMessage={handleOnMessage}
      />
    </SafeAreaView>
  );
};

export default ItemPost;
