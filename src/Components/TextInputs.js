import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import {appColors} from '../Utiles/appColors';
import {fonts} from '../Utiles/appFont';

const TextInputs = ({
  fieldName = '',
  placeholder,
  value,
  onchange,
  secureTextEntry,
  errorText='',
}) => {

console.log(errorText,'errorText')

  return (
    <View>
      {fieldName != '' && (
        <Text
          style={{
            fontSize: 25,
            color: appColors.grey,
            fontFamily: fonts.interBold,
          }}>
          {fieldName}
        </Text>
      )}
      <Pressable
        style={{
          flexDirection: 'row',
          // alignItems: 'center',
          justifyContent: 'space-between',
          borderWidth: 1,
          borderColor: appColors.grey,
          borderRadius: 10,
        }}>
        <TextInput
          style={{flex: 1}}
          placeholder={placeholder}
          value={value}
          onChangeText={onchange}
          secureTextEntry={secureTextEntry}
        />
      </Pressable>
      {errorText != '' && (
        <Text
          style={{
            fontSize: 10,
            color: appColors.red,
            fontFamily: fonts.interBold,
          }}>
          {errorText}
        </Text>
      )}
    </View>
  );
};

export default TextInputs;

const styles = StyleSheet.create({});
