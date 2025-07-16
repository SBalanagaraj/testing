import './gesture-handler';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import AuthStack from './src/Navigation/Stack';
import {NavigationContainer} from '@react-navigation/native';
import {getFavorites} from './src/Utiles/Storage';

const screenWidth = Dimensions.get('screen');

const App = () => {
  useEffect(() => {
    (async () => {
      await getFavorites();
    })();
  }, []);

  return (
    <NavigationContainer>
      {/* <AuthStack /> */}
      <Text>testing</Text>
      <Text>testing</Text>
      <Text>testing</Text>
      <Text>testing</Text>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  box: {
    width: screenWidth / 3,
    backgroundColor: 'orange',
    marginHorizontal: 10,
  },
});
