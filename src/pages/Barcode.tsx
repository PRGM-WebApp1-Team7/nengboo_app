import React, {useState, useEffect, useCallback} from 'react';
import {SafeAreaView, Platform} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Code, CodeScannerFrame, PhotoFile} from 'react-native-vision-camera';
import BarcodeScanner from '../components/BarcodeScanner.tsx';
import useCameraPermissions from '../hooks/useCameraPermission.tsx';
import {RESULTS} from 'react-native-permissions';
import {supabase} from '../utils/supabase.tsx';
import RNFetchBlob from 'rn-fetch-blob';
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
      } else if (photoCaptured) {
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
            product_cookable: true,
            product_image: data.product_image,
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

  const handleImageCaptured = async (
    photo: PhotoFile,
    barcodeData?: string,
  ) => {
    try {
      const fileName = `public/product_${Date.now()}.jpeg`;
      const fileUri = photo.path;
      const response = await RNFetchBlob.fetch(
        'POST',
        `https://whrmaertzkkanlgksexz.supabase.co/storage/v1/object/images/${fileName}`,
        {
          'Content-Type': 'multipart/form-data',
          Authorization: // 액세스 토큰 (시간 만료)
            'Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6IjBNNWdPNnZBcGM4eGxvc1kiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzE1ODcyOTk0LCJpYXQiOjE3MTU4NjkzOTQsImlzcyI6Imh0dHBzOi8vd2hybWFlcnR6a2thbmxna3NleHouc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6IjYzOTY1N2Y4LTdlYTQtNGNkNC1iMTI2LWNhZjdhOWUxNTRkYiIsImVtYWlsIjoienppeWEyMDA2QGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoia2FrYW8iLCJwcm92aWRlcnMiOlsia2FrYW8iLCJnb29nbGUiXX0sInVzZXJfbWV0YWRhdGEiOnsiYXZhdGFyX3VybCI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0wzUGdyVDQtTUdTWlpYUWFxUU5jdzdkZFZzRWZtVE1rSHFObklCUmxFOXVUUVlnWmtJPXM5Ni1jIiwiZW1haWwiOiJ6eml5YTIwMDZAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZ1bGxfbmFtZSI6IkFnIiwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy5nb29nbGUuY29tIiwibmFtZSI6IkFnIiwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jTDNQZ3JUNC1NR1NaWlhRYXFRTmN3N2RkVnNFZm1UTWtIcU5uSUJSbEU5dVRRWWdaa0k9czk2LWMiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiLsnbTsp4DsnYAiLCJwcm92aWRlcl9pZCI6IjExMDQ1MDU2MzM0NjQ4NzU3NTA1NCIsInN1YiI6IjExMDQ1MDU2MzM0NjQ4NzU3NTA1NCIsInVzZXJfbmFtZSI6IuydtOyngOydgCJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6Im9hdXRoIiwidGltZXN0YW1wIjoxNzE1ODY5Mzk0fV0sInNlc3Npb25faWQiOiJlZWJjNTU4Ni00MjhkLTRiYTItOWNmOS1hZTUzODBkNGUwNjUiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.kCL1p3hfDw3YvWKqDFXUo2iUgEpWFGy-hRgrkQe8d7M',
        },
        [
          {
            name: 'image',
            filename: fileName,
            type: 'image/jpeg',
            data: RNFetchBlob.wrap(fileUri),
          },
        ],
      );

      if (response.respInfo.status !== 200) {
        console.error('이미지 업로드 실패', response.data);
        return;
      }

      const publicUrl = await supabase.storage
        .from('images')
        .getPublicUrl(fileName);
      const product_image = publicUrl.data.publicUrl;

      if (barcodeData) {
        await supabase
          .from('products')
          .update({product_image: product_image})
          .eq('barcode', barcodeData);
        setPhotoCaptured(true);
      } else {
        const insertData = {
          product_image: product_image,
          product_cookable: 'ingredient',
        };

        const {data: insertedData, error: insertError} = await supabase
          .from('products')
          .insert([insertData])
          .select('product_id')

        if (insertError) {
          throw new Error('제품 정보 삽입 실패: ' + insertError.message);
        }
        setProductId(product_id);
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
