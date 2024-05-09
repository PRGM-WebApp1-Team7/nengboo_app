import React from 'react';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
  Code,
  CodeScannerFrame,
} from 'react-native-vision-camera';

interface BarcodeScannerProps {
  onBarcodeScanned?: (codes: Code[], frame: CodeScannerFrame) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({onBarcodeScanned}) => {
  const device = useCameraDevice('back');
  const codeScanner = useCodeScanner({
    codeTypes: ['ean-13', 'upc-a'],
    onCodeScanned: (codes, frame) => {
      if (onBarcodeScanned) {
        onBarcodeScanned(codes, frame);
      }
    },
  });

  if (device == null) return null;

  return (
    <Camera
      style={{flex: 1}}
      device={device}
      isActive={true}
      codeScanner={codeScanner}
    />
  );
};

export default BarcodeScanner;
