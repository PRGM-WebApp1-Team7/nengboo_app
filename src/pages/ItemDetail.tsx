import React from 'react';
import {SafeAreaView} from 'react-native';
import {WebView} from 'react-native-webview';
import {LOCAL_URL, HOSTING_URL} from '@env';
import {RouteProp} from '@react-navigation/native';
import type {RootStackParamList} from '../Router';

type ItemDetailRouteProp = RouteProp<RootStackParamList, 'ItemDetail'>;

type Props = {
  route: ItemDetailRouteProp;
};

const ItemDetail: React.FC<Props> = ({route}) => {
  const {product_id} = route.params;

  const handleImageCaptured = async (photo: string) => {
    console.log('Photo path:', photo);
  };
  
  return (
    <SafeAreaView className={`flex flex-1`}>
      <WebView
        source={{
          uri:
            __DEV__ === true
              ? `${LOCAL_URL}/itemDetail?product_id=${product_id}`
              : `${HOSTING_URL}/itemDetail?product_id=${product_id}`,
        }}
      />
    </SafeAreaView>
  );
};

export default ItemDetail;
