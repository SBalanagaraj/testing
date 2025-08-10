import {Alert, Linking, PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {print} from '../Utiles/HelperFunction';
import {useDispatch} from 'react-redux';
import {setUserLocation} from '../Redux/settingSlice';
import {useNavigation} from '@react-navigation/native';

export const requestLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const status = await Geolocation.requestAuthorization('always');
    if (status === 'granted') {
      console.log('Permission granted for iOS');
      return true;
    } else {
      console.log('Permission denied for iOS');
      return false;
    }
  } else {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      print(granted, 'granted');
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permission granted for Android');
        return true;
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        console.log('Permission permanently denied for Android');
        return 'settings';
      } else {
        console.log('Permission denied for Android');
        return false;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  }
};

export const handleLocationPermission = async () => {
  const permission = await requestLocationPermission();
  if (permission === true) {
    console.log('Permission granted');
    // Proceed with location access
  } else if (permission === 'settings') {
    console.log('Directing user to settings');
    // Show a dialog to guide the user to enable permissions manually
    Alert.alert(
      'Permission Required',
      'Location permission is required. Please enable it in the app settings.',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Open Settings', onPress: () => Linking.openSettings()},
      ],
    );
  } else {
    console.log('Permission denied');
    // Show a message or retry logic
  }
};

// Get Current Location
export const getUserLocation = async (coordinates = '') => {
  // const dispatch = useDispatch();
  // const navigation = useNavigation();

  try {
    let position = '';
    const result = await requestLocationPermission();
    // if (coordinates == '') {
    if (result) {
      position = await new Promise((resolve, reject) => {
        console.log('its enter');
        Geolocation.getCurrentPosition(
          position => resolve(position),
          error => reject(error),
          {enableHighAccuracy: true, timeout: 15000},
        );
      });
    }
    // }

    const latitude =
      coordinates != '' ? coordinates.latitude : position.coords.latitude;
    const longitude =
      coordinates != '' ? coordinates.longitude : position.coords.longitude;
    const myApiKey = 'AIzaSyANNOH9BFWujPDbF0vxK-1sm5nD-Qg_kY8';

    const findResult = (results, name) => {
      const result = results.find(obj => obj.types.includes(name));
      return result ? result.long_name : '';
    };

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${myApiKey}`,
    );

    if (response.status === 200) {
      const resparse = await response.json();
      if (resparse.results && resparse.results.length > 0) {
        const results = resparse.results[0].address_components;
        const street = [
          findResult(results, 'route'),
          findResult(results, 'sublocality_level_2'),
          findResult(results, 'sublocality_level_1'),
          findResult(results, 'locality'),
        ]
          .filter(val => val !== '')
          .join(', ');

        const city = findResult(results, 'administrative_area_level_3');
        const state = findResult(results, 'administrative_area_level_1');
        const pincode = findResult(results, 'postal_code');

        const address = {
          street,
          city,
          state,
          pincode,
        };
        // dispatch(setUserLocation(address));
        // navigation.navigate('merchantOverView');
        // console.log(address, 'address');
        return address;
      } else {
        throw new Error('No address components found');
      }
    } else {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.log('Error getting location:', error.message || error);
    return null;
  }
};
