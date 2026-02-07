import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {fonts} from '../Utiles/appFont';
import {appColors} from '../Utiles/appColors';

const Buttons = ({onPress, title, altStyle = {}, altText = {}}) => {
  return (
    <TouchableOpacity
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: appColors.orange,
          padding: 5,
          borderRadius: 10,
          shadowOpacity: 0.5,
        },
        altStyle,
      ]}
      onPress={onPress}>
      <Text
        style={[
          {
            fontFamily: fonts.interBold,
            color: appColors.white,
            fontSize: 25,
          },
          altText,
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Buttons;

const styles = StyleSheet.create({});
