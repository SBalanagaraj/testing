import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {appColors} from '../Utiles/appColors';
import {fontScalling} from '../Utiles/HelperFunction';

const SearchBlock = ({srchFn = () => {}}) => {
  const [srchTerm, setSrchTerm] = useState('');
  return (
    <Pressable style={styles.searchCont}>
      <Image
        style={{width: 25, height: 25}}
        resizeMode="contain"
        source={require('../assets/Image/search.png')}
      />
      <TextInput
        style={{
          paddingHorizontal: 20,
          paddingVertical: 0,
          margin: 0,
          fontSize: fontScalling(2),
          flex: 1,
        }}
        onChangeText={val => {
          srchFn(val);
          setSrchTerm(val);
        }}
        value={srchTerm}
        placeholder="Search Merchants"
        placeholderTextColor={appColors.placeHolderClr}
      />
    </Pressable>
  );
};

export default SearchBlock;

const styles = StyleSheet.create({
  searchCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: appColors.borderPink,
    elevation: 0.2,
    shadowColor: appColors.pink,
    borderRadius: 25,
    backgroundColor: `${appColors.searchColor}`,
  },
});
