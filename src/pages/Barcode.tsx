import React, {useState, useEffect, useCallback} from 'react';
import {SafeAreaView} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Code, CodeScannerFrame} from 'react-native-vision-camera';
import BarcodeScanner from '../components/BarcodeScanner.tsx';
import useCameraPermissions from '../hooks/useCameraPermission.tsx';
import {RESULTS} from 'react-native-permissions';
import {styled} from 'nativewind';

const StyledSafeAreaView = styled(SafeAreaView);

const Barcode: React.FC<{navigation: any}> = ({navigation}) => {
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

  const handleBarcodeScanned = (codes: Code[], frame: CodeScannerFrame) => {
    if (codes.length > 0) {
      const barcodeData: Code = codes[0];
      // 바코드 데이터 처리 로직
      console.log('Scanned barcode:', barcodeData.value);
      setIsScanning(false);
    } else {
      console.log('바코드를 찾지 못했습니다.');
    }
  };

  return (
    <StyledSafeAreaView className="flex-1">
      {isScanning ? (
        <BarcodeScanner onBarcodeScanned={handleBarcodeScanned} />
      ) : null}
    </StyledSafeAreaView>
  );
};
export default Barcode;
