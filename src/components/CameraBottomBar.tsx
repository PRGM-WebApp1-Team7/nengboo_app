import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import circle from '../assets/circle.png';
import cancel from '../assets/cancel.png';

interface CameraBottomBarProps {
  isScanningMode: boolean;
  isCapturingPhoto: boolean;
  onCameraModeChange: (mode: 'scan' | 'photo') => void;
  onCapturePhoto: () => Promise<void>;
  navigation: StackNavigationProp<any, any>;
}

const CameraBottomBar: React.FC<CameraBottomBarProps> = ({
  isScanningMode,
  isCapturingPhoto,
  onCameraModeChange,
  onCapturePhoto,
}) => {
  const [isBarcodeScanPressed, setIsBarcodeScanPressed] = useState(true);
  const [isCapturePhotoPressed, setIsCapturePhotoPressed] = useState(false);
  const navigation = useNavigation();

  const handleBarcodeScanPress = () => {
    setIsBarcodeScanPressed(true);
    setIsCapturePhotoPressed(false);
    onCameraModeChange('scan');
  };

  const handleCapturePhotoPress = () => {
    setIsBarcodeScanPressed(false);
    setIsCapturePhotoPressed(true);
    onCameraModeChange('photo');
  };

  return (
    <View
      className={`absolute bottom-0 left-0 right-0 bg-black opacity-90 py-4 px-6 rounded-t-lg`}>
      <View className={`flex-row justify-between items-center mb-6`}>
        <TouchableOpacity onPress={handleBarcodeScanPress}>
          <Text
            className={`font-pretendard-bold text-lg ${
              isScanningMode ? 'text-yellow-500' : 'text-white'
            }`}>
            바코드 스캔
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCapturePhotoPress}>
          <Text
            className={`font-pretendard-bold text-lg ${
              isCapturingPhoto ? 'text-yellow-500' : 'text-white'
            }`}>
            사진 촬영
          </Text>
        </TouchableOpacity>
      </View>

      <View className={`flex-row justify-center items-center`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={cancel} className={`opacity-100 w-8 h-8`} />
        </TouchableOpacity>
        <View className={`flex-1 items-center`}>
          <TouchableOpacity
            onPress={isCapturingPhoto ? onCapturePhoto : undefined}
            className={`mr-8`}>
            <Image source={circle} className={`opacity-100 w-30 h-30`} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CameraBottomBar;
