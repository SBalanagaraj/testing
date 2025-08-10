import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {fontScalling, print, widthResponse} from '../Utiles/HelperFunction';
import {appColors} from '../Utiles/appColors';
import {fonts} from '../Utiles/appFont';
import 'react-native-get-random-values';
import HeaderBlock from '../Components/HeaderBlock';
import {EvilIcons} from '@react-native-vector-icons/evil-icons';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {
  getUserLocation,
  handleLocationPermission,
  requestLocationPermission,
} from '../Utiles/GeoLocation';
import {useDispatch} from 'react-redux';
import {setUserLocation} from '../Redux/settingSlice';

const locationScreen = ({navigation}) => {
  const ref = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    ref.current?.setAddressText('Some Text');
  }, []);

  const handlePress = dta => {
    dispatch(setUserLocation({address: dta.address}));
    ToastAndroid.show('Location Updated succes Fully', ToastAndroid.LONG);
    navigation.navigate('merchantOverView');
  };

  return (
    <View style={styles.container}>
      <HeaderBlock leftIcon={true} title="Search Location" />
      <Pressable
        onPress={async () => {
          const isGranted = await requestLocationPermission();
          if (isGranted && isGranted != 'settings') {
            const address = await getUserLocation();
            console.log(address, 'address');
            if (address && Object.keys(address).length > 0) {
              console.log('---');
              dispatch(setUserLocation(address));
              ToastAndroid.show(
                'Location Updated succes Fully',
                ToastAndroid.LONG,
              );

              navigation.navigate('merchantOverView');
            }
          } else {
            await handleLocationPermission();
          }
        }}
        style={[
          styles.flexRow,
          {marginTop: 20, justifyContent: 'flex-start', paddingLeft: 15},
        ]}>
        <Image
          style={{width: 20, height: 20}}
          source={require('../assets/Image/locat.png')}
          resizeMode="cover"
        />
        {
          <Text
            style={[styles.subText, {paddingLeft: 10, color: appColors.pink}]}>
            Use Current Location
          </Text>
        }
      </Pressable>
      <GooglePlacesAutocomplete
        query={{
          key: 'AIzaSyANNOH9BFWujPDbF0vxK-1sm5nD-Qg_kY8',
          language: 'en',
        }}
        placeholder="Where to?"
        fetchDetails={true}
        debounce={200}
        enablePoweredByContainer={true}
        nearbyPlacesAPI="GooglePlacesSearch"
        minLength={2}
        timeout={10000}
        keyboardShouldPersistTaps="handled"
        listViewDisplayed="auto"
        keepResultsAfterBlur={false}
        currentLocation={false}
        currentLocationLabel="Current location"
        enableHighAccuracyLocation={true}
        onFail={() => console.warn('Google Places Autocomplete failed')}
        onNotFound={() => console.log('No results found')}
        onTimeout={() => console.warn('Google Places request timeout')}
        predefinedPlaces={[]}
        predefinedPlacesAlwaysVisible={false}
        styles={{
          textInputContainer: styles.searchCont,
          textInput: styles.textInput,
          listView: {
            backgroundColor: 'white',
            position: 'relative',
            top: 0,
            width: '100%',
            zIndex: 99,
            borderRadius: 10,
            shadowColor: '#d4d4d4',
          },

          description: {
            color: appColors.textColor,
            fontSize: fontScalling(2),
            fontFamily: fonts.PPM,
          },
          separator: {
            borderWidth: 0.4,
            borderColor: appColors.placeHolderClr,
          },
        }}
        onPress={(data, details = null) => {
          if (!details?.geometry?.location) {
            console.warn('Missing geometry details!');
            return;
          }

          handlePress({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            address: data.description,
          });
        }}
        GooglePlacesSearchQuery={{
          rankby: 'distance',
          radius: 1000, // <-- REQUIRED if using 'distance'
        }}
        renderLeftButton={() => (
          <View className="justify-center items-center w-6 h-6">
            <Image
              style={{width: 25, height: 25}}
              resizeMode="contain"
              source={require('../assets/Image/search.png')}
            />
          </View>
        )}
        textInputProps={{
          placeholderTextColor: 'gray',
          placeholder: 'choose your location?',
          backgroundColor: 'transparent',
        }}
        renderRow={rowData => {
          return (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                justifyContent: 'space-between',
                flex: 1,
              }}>
              {/* Left icon */}
              <View style={[styles.flexRow, {justifyContent: 'flex-start'}]}>
                <EvilIcons
                  name="location"
                  size={widthResponse ? 27 : 30}
                  color={appColors.black}
                />

                {/* Place description */}
                <Text
                  style={{
                    fontSize: 16,
                    color: appColors.textColor,
                    flex: 0.8,
                    paddingLeft: 15,
                  }}>
                  {rowData.description}
                </Text>
              </View>
              {/* Right icon */}
              <MaterialIcons
                name="arrow-outward"
                size={22}
                color={appColors.black}
              />
            </View>
          );
        }}
      />
    </View>
  );
};

export default locationScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.bgWhite,
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerCon: {
    paddingHorizontal: 20,
    paddingBlock: 15,
  },
  searchCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: appColors.borderPink,
    elevation: 0.2,
    shadowColor: appColors.pink,
    borderRadius: 25,
    backgroundColor: `${appColors.searchColor}`,
    marginTop: 10,
  },
  textInput: {
    paddingHorizontal: 20,
    paddingVertical: 0,
    margin: 0,
    fontSize: fontScalling(2),
    flex: 1,
  },
  flexRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subText: {
    color: appColors.textColor,
    fontSize: fontScalling(1.8),
    fontFamily: fonts.PPR,
  },
});
