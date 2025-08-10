// src/utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveAddress = 'saveAddress';

export const getAddress = async () => {
  const json = await AsyncStorage.getItem(saveAddress);
  return json != null ? JSON.parse(json) : [];
};

export const setAddress = async favorites => {
  await AsyncStorage.setItem(saveAddress, JSON.stringify(favorites));
};
