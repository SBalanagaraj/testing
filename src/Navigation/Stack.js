import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import UserList from '../screens/UserList';
import Favorites from '../screens/FavouriteList';

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="welcome"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="welcome" component={WelcomeScreen} />
      <Stack.Screen name="userList" component={UserList} />
      <Stack.Screen name="favorites" component={Favorites} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
