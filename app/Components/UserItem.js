// src/components/UserItem.js
import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {fonts} from '../Utiles/appFont';

const UserItem = ({user, isFavorite, onToggleFavorite}) => {
  return (
    <View style={styles.container}>
      <Image source={{uri: user.avatar}} style={styles.avatar} />
      <View style={{flex: 1}}>
        <Text style={styles.text}>
          {user.first_name} {user.last_name}
        </Text>
        <Text style={styles.text}>{user.email}</Text>
      </View>
      <TouchableOpacity onPress={() => onToggleFavorite(user)}>
        <Icon
          name={isFavorite ? 'favorite' : 'favorite-border'}
          size={24}
          color={isFavorite ? 'red' : 'gray'}
        />
      </TouchableOpacity>
    </View>
  );
};

export default UserItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  text: {
    color: '#000',
    fontFamily: fonts.interRegular,
    fontSize: 15,
  },
});
