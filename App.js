import './gesture-handler';
import {
  Dimensions,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import splashScreen from 'react-native-splash-screen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MyTabs from './app/Navigation/BottomTab';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const screenWidth = Dimensions.get('screen');

const App = () => {
  useEffect(() => {
    (async () => {
      splashScreen.hide();
    })();
  }, []);

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <SafeAreaProvider style={{flex: 1}}>
          <NavigationContainer
          // linking={linking}
          >
            <StatusBar
              translucent={false}
              networkActivityIndicatorVisible={true}
              backgroundColor={'transparent'}
              showHideTransition={'slide'}
              barStyle={'dark-content'}
              hidden={false}
              animated={true}
            />
            <MyTabs />
          </NavigationContainer>
        </SafeAreaProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({});
