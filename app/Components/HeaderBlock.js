import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {fonts} from '../Utiles/appFont';
import {appColors} from '../Utiles/appColors';
import {fontScalling} from '../Utiles/HelperFunction';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useNavigation} from '@react-navigation/native';

const HeaderBlock = ({title = '', leftIcon = false}) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: leftIcon ? 'flex-start' : 'center',
      }}>
      {leftIcon && (
        <MaterialIcons
          // style={{marginRight: 20}}
          onPress={() => navigation.goBack()}
          name="arrow-back"
          size={30}
          color={appColors.pink}
        />
      )}
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

export default HeaderBlock;

const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.PPSM,
    color: appColors.textColor,
    fontSize: fontScalling(3),
    fontWeight: '800',
    textAlign: 'center',
    paddingLeft: 50,
  },
});
