import './gesture-handler';
import {Dimensions, StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import splashScreen from 'react-native-splash-screen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import HomeStack from './app/Navigation/Stack';
import MyTabs from './app/Navigation/BottomTab';
import {checkNotificationPermission} from './app/Notifications/Notification';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const screenWidth = Dimensions.get('screen');

const App = () => {
  useEffect(() => {
    (async () => {
      splashScreen.hide();
      await checkNotificationPermission();
    })();
  }, []);

  const linking = {
    prefixes: ['kittymagic://', 'https://kittymagic.app'],
    config: {
      screens: {
        MerchantDetail: 'merchant/:slug',
      },
    },
  };

  // AIzaSyAyIl3DIPmii2WqOmMf3HAF2JRY-ErNu7o  apiKey

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <SafeAreaProvider style={{flex: 1}}>
          <NavigationContainer
            linking={linking}
            fallback={<Text>Loading...</Text>}>
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
