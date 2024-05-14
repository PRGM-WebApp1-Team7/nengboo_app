import React, {useState, useEffect, useCallback} from 'react';
import {SafeAreaView, Alert} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Code, CodeScannerFrame} from 'react-native-vision-camera';
import BarcodeScanner from '../components/BarcodeScanner.tsx';
import useCameraPermissions from '../hooks/useCameraPermission.tsx';
import {RESULTS} from 'react-native-permissions';
import {supabase} from '../utils/supabase.tsx';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../Router';

type BarcodeProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Scan'>;
};

const Barcode: React.FC<BarcodeProps> = ({navigation}) => {
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [permissionStatus, checkAndRequestPermission] = useCameraPermissions();

  useFocusEffect(
    useCallback(() => {
      const checkPermissionStatus = async () => {
        const status = await checkAndRequestPermission();
        setIsScanning(status === RESULTS.GRANTED);
        if (
          status === RESULTS.DENIED ||
          status === RESULTS.BLOCKED ||
          status === RESULTS.UNAVAILABLE
        ) {
          navigation.goBack();
        }
      };

      checkPermissionStatus();
    }, [checkAndRequestPermission, navigation]),
  );

  useEffect(() => {
    if (permissionStatus === RESULTS.GRANTED) {
      setIsScanning(true);
    } else {
      setIsScanning(false);
    }
  }, [permissionStatus]);

  const handleBarcodeScanned = async (codes: Code[]) => {
    if (codes.length > 0) {
      const barcodeData = codes[0].value;
      try {
        const {data, error} = await supabase
          .from('products_info')
          .select('*')
          .ilike('barcode', `%${barcodeData}%`)
          .single();

        if (error) {
          console.error('Error fetching product info:', error);
          throw error;
        }

        if (data) {
          const insertData = {
            product_id: data.id,
            refrige_id: null,
            product_name: data.product_name,
            product_expiration_date: data.product_expiration_date,
            product_type: data.product_type,
            product_frozen_storage: null,
            product_created_date: new Date().toISOString(),
            product_updated_date: null,
            barcode: data.barcode,
            product_memo: null,
            product_quantity: 1,
          };

          const {error: insertError} = await supabase
            .from('products')
            .insert([insertData]);

          if (insertError) {
            throw new Error('제품 정보 삽입 실패: ' + insertError.message);
          }

          navigation.navigate('ItemDetail', {product_id: data.id});
        } else {
          Alert.alert(
            '바코드에 해당하는 제품 정보가 없습니다. 수동 등록해주세요.',
          );
          navigation.navigate('ItemPost');
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      Alert.alert('바코드를 찾을 수 없습니다', '다시 스캔해 주세요.');
    }
  };

  return (
    <SafeAreaView className={`flex flex-1`}>
      {isScanning ? (
        <BarcodeScanner onBarcodeScanned={handleBarcodeScanned} />
      ) : null}
    </SafeAreaView>
  );
};

export default Barcode;
