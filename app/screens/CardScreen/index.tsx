import React from 'react';
import {Text, View} from 'react-native';
import {styles} from './style';

const CardScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Cards</Text>
      <Text style={styles.subtitle}>This is a placeholder Cards screen.</Text>
    </View>
  );
};

export default CardScreen;

