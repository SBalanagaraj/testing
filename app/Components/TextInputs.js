import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import {appColors} from '../Utiles/appColors';
import {fonts} from '../Utiles/appFont';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {Entypo} from '@react-native-vector-icons/entypo';

const TextInputs = ({
  fieldName = '',
  placeholder,
  value,
  onchange,
  secureTextEntry,
  errorText = '',
  altStyle = {},
}) => {
  const [visible, setVisible] = useState(false);
  return (
    <View style={altStyle}>
      {fieldName != '' && (
        <Text
          style={{
            fontSize: 16,
            color: appColors.textColor,
            fontFamily: fonts.GR_semiBold,
          }}>
          {fieldName}
        </Text>
      )}
      <Pressable
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderColor: appColors.grey,
        }}>
        <TextInput
          style={{flex: 1}}
          placeholder={placeholder}
          value={value}
          onChangeText={onchange}
          secureTextEntry={secureTextEntry}
        />
        {secureTextEntry && (
          <Pressable
            onPress={() => {
              setVisible(!visible);
            }}>
            <Entypo
              name={visible ? 'eye' : 'eye-with-line'}
              color="#ff0000"
              size={20}
            />
          </Pressable>
        )}
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
