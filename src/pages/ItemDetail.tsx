import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {WebView} from 'react-native-webview';
import {LOCAL_URL, HOSTING_URL} from '@env';
import {RouteProp} from '@react-navigation/native';
import type {RootStackParamList} from '../Router';
import {getData} from '../utils/asyncstorage';

type ItemDetailRouteProp = RouteProp<RootStackParamList, 'ItemDetail'>;

type Props = {
  route: ItemDetailRouteProp;
};

const ItemDetail: React.FC<Props> = ({route}) => {
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
  return (
    <SafeAreaView className={`flex flex-1`}>
      <WebView
        source={{
          uri:
            __DEV__ === true
              ? `${LOCAL_URL}/itemDetail?product_id=${product_id}&refrige_id=${refrige}&user_id=${user}`
              : `${HOSTING_URL}/itemDetail?product_id=${product_id}&refrige_id=${refrige}&user_id=${user}`,
        }}
      />
    </SafeAreaView>
  );
};

export default ItemDetail;
