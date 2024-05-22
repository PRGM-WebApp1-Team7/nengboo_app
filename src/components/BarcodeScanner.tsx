import React, {useState, useRef} from 'react';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
  Code,
  PhotoFile,
} from 'react-native-vision-camera';
import {View, Alert} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import CameraBottomBar from './CameraBottomBar.tsx';
import type {RootStackParamList} from '../Router';

interface BarcodeScannerProps {
  onBarcodeScanned?: (codes: Code[], photo?: PhotoFile) => void;
  onImageCaptured?: (photo: PhotoFile, barcodeData?: string) => void;
  navigation: StackNavigationProp<RootStackParamList, 'Scan'>;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onBarcodeScanned,
  onImageCaptured,
  navigation,
}) => {
  const device = useCameraDevice('back');
  const [isScanningMode, setIsScanningMode] = useState(true);
  const [isCapturingPhoto, setIsCapturingPhoto] = useState(false);
  const cameraRef = useRef<Camera>(null);

  if (device == null) return null;

  const onCameraModeChange = (mode: 'scan' | 'photo') => {
    if (mode === 'scan') {
      setIsScanningMode(true);
      setIsCapturingPhoto(false);
    } else {
      setIsScanningMode(false);
      setIsCapturingPhoto(true);
    }
  };

  const onCapturePhoto = async () => {
    if (cameraRef.current !== null) {
      setIsCapturingPhoto(true);
      const photo = await cameraRef.current.takePhoto();
      setIsCapturingPhoto(false);
      if (onImageCaptured) {
        onImageCaptured(photo);
      }
    }
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['ean-13', 'upc-a'],
    onCodeScanned: codes => {
      if (isScanningMode && onBarcodeScanned) {
        setIsScanningMode(false);
        Alert.alert('바코드 스캔 완료', '상품 사진을 등록해주세요.', [
          {
            text: '확인',
            onPress: () => {
              onBarcodeScanned(codes);
              onCameraModeChange('photo');
            },
          },
          {
            text: '취소',
            onPress: () => console.log('취소되었습니다.'),
            style: 'cancel',
          },
        ]);
      }
    },
  });

  return (
    <View className={`flex flex-1`}>
      <Camera
        ref={cameraRef}
        style={{flex: 1}}
        device={device}
        isActive={true}
        codeScanner={isScanningMode ? codeScanner : undefined}
        photo={true}
      />
      <CameraBottomBar
        isScanningMode={isScanningMode}
        isCapturingPhoto={isCapturingPhoto}
        onCameraModeChange={onCameraModeChange}
        onCapturePhoto={onCapturePhoto}
        navigation={navigation}
      />
    </View>
  );
};

export default BarcodeScanner;
