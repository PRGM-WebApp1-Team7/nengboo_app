import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async value => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('userInfo', jsonValue);
  } catch (e) {
    console.log('asyncstorage error', e);
  }
};
export const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('userInfo');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log('asyncstorage error', e);
  }
};
