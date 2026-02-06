import React from 'react';
import {Text, View} from 'react-native';
import {styles} from './style';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>This is a placeholder Profile screen.</Text>
    </View>
  );
};

export default ProfileScreen;

