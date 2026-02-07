import './gesture-handler';
import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  ActivityIndicator,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import splashScreen from 'react-native-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import MyTabs from './src/Navigation/BottomTab';
import GoogleAuthScreen from './src/screens/GoogleAuthScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    // Configure Google Signin
    GoogleSignin.configure({
      webClientId: "783632660361-1kpo6encf1o63jdfbnassd6tcf832uhf.apps.googleusercontent.com",
    });

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    if (!initializing) {
      splashScreen.hide();
    }
  }, [initializing]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar
            translucent={false}
            networkActivityIndicatorVisible={true}
            backgroundColor={'transparent'}
            showHideTransition={'slide'}
            barStyle={'dark-content'}
            hidden={false}
            animated={true}
          />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
              <Stack.Screen name="Home" component={MyTabs} />
            ) : (
              <Stack.Screen name="Login" component={GoogleAuthScreen} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
