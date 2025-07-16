import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {appColors} from '../Utiles/appColors';
import {fonts} from '../Utiles/appFont';

const WelcomeScreen = ({navigation}) => {
  return (
    <View
      style={{
        backgroundColor: appColors.grey,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          color: appColors.orange,
          fontFamily: fonts.semiBold,
          fontSize: 40,
        }}>
        WelcomeScreen
      </Text>
      <Pressable
        onPress={() => navigation.navigate('userList')}
        style={{
          padding: 10,
          backgroundColor: appColors.orange,
          borderRadius: 10,
        }}>
        <Text
          style={{
            color: appColors.white,
            fontFamily: fonts.semiBold,
            fontSize: 10,
          }}>
          Check UserList
        </Text>
      </Pressable>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({});
