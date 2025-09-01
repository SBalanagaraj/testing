import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {appColors} from '../Utiles/appColors';
import {FontAwesome} from '@react-native-vector-icons/fontawesome';

const ViewGoogleMeet = ({navigation}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          navigation.navigate('webview');
        }}>
        <FontAwesome name="video-camera" size={22} color={appColors.bgWhite} />
        <Text style={styles.fabText}>Open Google Meet</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ViewGoogleMeet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    backgroundColor: '#ff4081',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 25,
    padding: 10,
    shadowColor: appColors.textColor,
    paddingInline: 20,
    borderWidth: 2.5,
    borderColor: appColors.bgWhite,
  },
  fabText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 2,
    paddingInline: 25,
  },
});
