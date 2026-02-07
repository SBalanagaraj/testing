import React from 'react';
import { Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { styles } from './styles';
import { useSelector, useDispatch } from 'react-redux';
import { clearUserInfo } from '../../Redux/userSlice';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const ProfileScreen = () => {
  const userInfo = useSelector(state => state.user.userInfo);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await auth().signOut();
      await GoogleSignin.revokeAccess();
      dispatch(clearUserInfo());
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to log out');
    }
  };

  return (
    <View style={styles.container}>
      {userInfo ? (
        <>
          <Image
            source={{ uri: userInfo.photoURL }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>{userInfo.displayName}</Text>
          <Text style={styles.email}>{userInfo.email}</Text>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.name}>No user logged in</Text>
      )}
    </View>
  );
};

export default ProfileScreen;

