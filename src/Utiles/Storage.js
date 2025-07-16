// src/utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'FAVORITE_USERS';

export const getFavorites = async () => {
  const json = await AsyncStorage.getItem(FAVORITES_KEY);
  return json != null ? JSON.parse(json) : [];
};

export const saveFavorites = async favorites => {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};
