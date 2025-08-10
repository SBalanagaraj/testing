import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MerchantOverView from '../screens/MerchantOverView';
import MerchantDetails from '../screens/MerchantDetails';
import locationScreen from '../screens/locationScreen';
import CouponsListSceen from '../screens/CouponsListSceen';
import AddReviewScreen from '../screens/AddReviews';
import ReviewListScreen from '../screens/ReviewListScreen';

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="merchantOverView"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="merchantOverView" component={MerchantOverView} />
      <Stack.Screen name="MerchantDetails" component={MerchantDetails} />
      <Stack.Screen name="location" component={locationScreen} />
      <Stack.Screen name="couponList" component={CouponsListSceen} />
      <Stack.Screen name="addReview" component={AddReviewScreen} />
      <Stack.Screen name="reviewList" component={ReviewListScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
