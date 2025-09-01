import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AddressList from '../screens/SavedAddress';
import AddressUpload from '../screens/AddressUpload';
import WebViewScreen from '../screens/WebViewScreen';
import ViewGoogleMeet from '../screens/ViewGoogleMeet';

const Stack = createStackNavigator();

export const AddressStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="addAddress"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="addAddress" component={AddressUpload} />
      <Stack.Screen name="addressList" component={AddressList} />
    </Stack.Navigator>
  );
};

export const WebViewStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="viewGoogleMeet"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="viewGoogleMeet" component={ViewGoogleMeet} />
      <Stack.Screen name="webview" component={WebViewScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({});
