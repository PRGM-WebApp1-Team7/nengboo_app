import {useState, useCallback} from 'react';
import {
  PermissionStatus,
  check,
  request,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
const useCameraPermissions = (): [
  PermissionStatus | null,
  () => Promise<PermissionStatus>,
] => {
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionStatus | null>(null);
  const checkAndRequestPermission =
    useCallback(async (): Promise<PermissionStatus> => {
      const status = await check(PERMISSIONS.ANDROID.CAMERA);
      setPermissionStatus(status);
      if (status === RESULTS.GRANTED) {
        return status;
      } else if (status === RESULTS.DENIED) {
        const result = await request(PERMISSIONS.ANDROID.CAMERA);
        setPermissionStatus(result);
        return result;
      } else {
        return status;
      }
    }, []);
  return [permissionStatus, checkAndRequestPermission];
};
export default useCameraPermissions;
