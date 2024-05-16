import React, {useState, useEffect, useCallback} from 'react';
import {SafeAreaView, Alert} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Code, CodeScannerFrame, PhotoFile} from 'react-native-vision-camera';
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
  const [barcodeScanned, setBarcodeScanned] = useState<boolean>(false);
  const [photoCaptured, setPhotoCaptured] = useState<boolean>(false);
  const [product_id, setProductId] = useState<string | null>(null);
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

  useEffect(() => {
    if (product_id) {
      if (barcodeScanned && photoCaptured) {
        navigation.navigate('ItemDetail', {product_id});
      } else {
        navigation.navigate('ItemPost');
      }
    }
  }, [barcodeScanned, photoCaptured, navigation, product_id]);

  const handleBarcodeScanned = async (codes: Code[], photo?: PhotoFile) => {
    if (codes.length > 0) {
      const barcodeData = codes[0].value;
      try {
        const {data, error} = await supabase
          .from('products_info')
          .select('*')
          .ilike('barcode', `%${barcodeData}%`)
          .single();

        if (error) {
          console.error('제품 정보 불러오기 실패:', error);
          throw error;
        }

        if (data) {
          const insertData = {
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
<<<<<<< HEAD
            product_cookable: 'ingredient',
=======
            product_cookable: true,
            product_image: data.product_image,
>>>>>>> e89338f95a8c6d017818527d221696b47a9db732
          };
          const {data: insertedData, error: insertError} = await supabase
            .from('products')
            .insert([insertData])
            .select('product_id');

          if (insertError) {
            throw new Error('제품 정보 삽입 실패: ' + insertError.message);
          }

          setProductId(insertedData[0].product_id);
          setBarcodeScanned(true);

          handleImageCaptured(photo!, barcodeData);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleImageCaptured = async (photo: PhotoFile, barcodeData?: string) => {
    try {
      const fileName = `public/product_${Date.now()}.jpg`;
      const {data: imageData, error: imageError} = await supabase.storage
        .from('images')
        .upload(fileName, photo, {
          contentType: 'image/jpeg',
        });
  
      if (imageError) {
        console.error('이미지 업로드 에러:', imageError.message);
      }
  
      const publicUrl = await supabase.storage
        .from('images')
        .getPublicUrl(`${imageData!.path}`);
  
      const url = publicUrl.data.publicUrl;
  
      if (barcodeData) {
        await supabase
          .from('products')
          .update({product_image: url})
          .eq('barcode', barcodeData);
  
        setPhotoCaptured(true);
      } else {
        const productData = {
          product_image: url,
          product_cookable: 'ingredient',
        };
  
        const {data: insertedData, error: insertError} = await supabase
          .from('products')
          .insert([productData])
          .select('product_id')
  
        if (insertError) {
          throw new Error('제품 정보 삽입 실패: ' + insertError.message);
        }
  
        setProductId(insertedData[0].product_id);
        setPhotoCaptured(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView className={`flex flex-1`}>
      {isScanning ? (
        <BarcodeScanner
          onBarcodeScanned={handleBarcodeScanned}
          onImageCaptured={handleImageCaptured}
          navigation={navigation}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default Barcode;