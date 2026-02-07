import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import {appColors} from '../Utiles/appColors';
import {fonts} from '../Utiles/appFont';
import {Entypo} from '@react-native-vector-icons/entypo';
import {fontScalling} from '../Utiles/HelperFunction';

const TextInputs = ({
  fieldName = '',
  placeholder,
  value,
  onChange,
  secureTextEntry,
  errorText = '',
  altStyle = {},
  required = false,
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

          {required ? (
            <Text
              style={{
                fontSize: 16,
                color: appColors.pink,
                fontFamily: fonts.GR_semiBold,
              }}>
              *
            </Text>
          ) : (
            ''
          )}
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
          onChangeText={onChange}
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
            fontSize: fontScalling(1.7),
            color: appColors.pink,
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
