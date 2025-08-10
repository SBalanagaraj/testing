import {
  Alert,
  FlatList,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  bottom_Height,
  fontScalling,
  scrnWidth,
  widthResponse,
} from '../Utiles/HelperFunction';
import {appColors} from '../Utiles/appColors';
import {getMerchantDetails} from '../api/Merchant';
import {Entypo} from '@react-native-vector-icons/entypo';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {EvilIcons} from '@react-native-vector-icons/evil-icons';
import SliderCarosal from '../Components/SliderCarosal';
import {fonts} from '../Utiles/appFont';
import {CouponCard} from '../Components/CouponCard';
import {couponsList} from '../Constants/CouponList';
import ReviewsSection from '../Components/ReviewsSection';
import ModalBottomSheet from '../Components/BottomSheet/ModalBottomSheet';

const MerchantDetails = ({navigation, route}) => {
  const [load, setLoad] = useState(false);
  const [details, setDetails] = useState([]);

  const [bottomModal, setBottomModal] = useState(false);

  const outlets = [
    {id: '1', name: 'Saravanampatti, Coimbatore', current: true},
    {id: '2', name: 'Thudiyalur, Coimbatore'},
    {id: '3', name: 'KGISL College, Coimbatore, 638701'},
    {id: '4', name: 'Gandhipuram, Coimbatore'},
  ];

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <View style={styles.row}>
        <Text style={styles.itemText}>{item.name}</Text>
      </View>
      {/* <Icon
        name={item.current ? 'check-circle' : 'chevron-right'}
        size={20}
        color={item.current ? '#FF4081' : '#999'}
      /> */}
    </View>
  );

  const data =
    route && route?.params && route?.params?.data != ''
      ? route?.params?.data
      : '';

  // api Fetch Data;
  useEffect(() => {
    if (data != '') {
      (async () => {
        setLoad(true);
        const res = await getMerchantDetails(data?.merchant_id);
        if (res && res.success) {
          setDetails(res.data?.data);
        }
        setLoad(false);
      })();
    }
  }, []);

  console.log(details.data?.[0]?.outlet_phone_number);

  const makeCall = async phoneNumber => {
    const url = `tel:${phoneNumber}`;
    const supported = await Linking.canOpenURL(url);
    if (true) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Unable to make a call');
    }
  };

  const openLocation = async locationUrl => {
    const supported = await Linking.canOpenURL(locationUrl);
    if (true) {
      await Linking.openURL(locationUrl);
    } else {
      Alert.alert('Error', 'Unable to open the map link');
    }
  };

  const btnData = [
    {
      name: 'call',
      img: require('../assets/Image/call.png'),
      link: details?.data?.[0]?.outlet_phone_number,
      linkin: () => makeCall(details?.data?.[0]?.outlet_phone_number),
    },
    {
      name: 'Locate Me',
      img: require('../assets/Image/location.png'),
      link: details?.data?.[0]?.outlet_loction_url,
      linkin: () => openLocation(details?.data?.[0]?.outlet_loction_url),
    },
    {
      name: 'View the website',
      img: require('../assets/Image/globe.png'),
      link: 'https://example.com',
      linkin: () => openLocation('https://www.starbucks.in/dashboard'),
    },
  ];

  // btn component
  const BtnComponent = ({data = {}, ind}) => {
    return (
      <>
        {Object.keys(data).length > 0 && (
          <Pressable
            onPress={data?.linkin}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              borderRadius: 10,
              borderColor: appColors.borderPink,
              borderWidth: 1,
              paddingHorizontal: 15,
              paddingVertical: 20,
              width: ind == 2 ? scrnWidth - 40 : scrnWidth / 2 - 30,
              marginBottom: 15,
              marginLeft: ind == 1 ? 20 : 0,
            }}>
            <Image
              source={data.img}
              resizeMode="contain"
              style={{width: 20, height: 20}}
            />
            <Text
              style={[
                styles.subText,
                {color: appColors.textColor, paddingLeft: 20},
              ]}>
              {data.name}
            </Text>
          </Pressable>
        )}
      </>
    );
  };

  return (
    <ScrollView
      style={[styles.container, {paddingBottom: bottom_Height + 150}]}>
      {/* Header */}
      <View style={[styles.flexRow, styles.headerCon]}>
        <MaterialIcons
          onPress={() => navigation.goBack()}
          name="arrow-back"
          size={25}
          color={appColors.pink}
        />
        <Entypo name="share" size={25} color={appColors.pink} />
      </View>
      <SliderCarosal data={data} />
      {/* rating And hotal block */}
      <View
        style={[
          {
            borderBottomWidth: 2,
            marginInline: 20,
            paddingBottom: 10,
            marginTop: 10,
            borderBottomColor: appColors.borderPink,
          },
        ]}>
        <View
          style={[
            styles.flexRow,
            {marginTop: 20, justifyContent: 'flex-start'},
          ]}>
          <Image
            style={{width: 20, height: 20}}
            source={require('../assets/Image/hotelIcon.png')}
            resizeMode="cover"
          />
          {data && data?.categories && (
            <Text style={[styles.subText, {paddingLeft: 15}]}>
              {data?.categories.map((dta, ind) => `${dta?.category_name}`)}
            </Text>
          )}
        </View>
        <View
          style={[
            styles.flexRow,
            {
              backgroundColor: appColors.bgWhite,
              paddingHorizontal: 5,
              paddingVertical: 5,
              justifyContent: 'flex-start',
              alignItems: 'center',
            },
          ]}>
          <MaterialIcons
            style={{marginLeft: -5}}
            name={'star-rate'}
            size={25}
            color={'gold'}
          />
          <Text
            style={[
              styles.subText,

              {
                textDecorationLine: 'underline',
                paddingLeft: 10,
                fontSize: fontScalling(1.5),
              },
            ]}>{`${data.avg_rating} ( 244 Reviews )`}</Text>
        </View>
      </View>
      {/* hotal name & location */}
      <View
        style={[
          styles.flexRow,
          {
            backgroundColor: appColors.bgWhite,
            paddingHorizontal: 20,
            paddingVertical: 8,
            justifyContent: 'flex-start',
          },
        ]}>
        <Image
          style={{width: 45, height: 45, borderRadius: 25}}
          source={{uri: data?.merchant_logo}}
          resizeMode="contain"
        />
        <View style={{paddingLeft: 10}}>
          <Text
            style={[
              {
                color: appColors.textColor,
                fontSize: fontScalling(2.5),
                fontFamily: fonts.PPSM,
                fontWeight: '700',
              },
            ]}>{`Green Leaf Restaurant`}</Text>
          <Pressable
            onPress={() => setBottomModal(true)}
            style={[
              styles.flexRow,
              {
                paddingVertical: 8,
              },
            ]}>
            <EvilIcons
              name="location"
              size={widthResponse ? 22 : 30}
              color={appColors.textColor}
              style={{marginLeft: -5}}
            />
            <Text
              style={[
                styles.locText,
                {color: appColors.textColor},
              ]}>{`${data.merchant_name} , ${data?.default_outlet?.outlet_loction_name}`}</Text>
          </Pressable>
        </View>
      </View>
      {/* bth's block */}
      <FlatList
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        style={{alignSelf: 'center'}}
        numColumns={2}
        ItemSeparatorComponent={() => <View style={{marginRight: 20}} />}
        // horizontal={true}
        data={btnData}
        renderItem={({item, index}) => (
          <BtnComponent key={index} data={item} ind={index} />
        )}
      />
      {/* About */}
      <View
        style={{
          marginHorizontal: 20,
          paddingBottom: 20,
          borderBottomColor: appColors.borderPink,
          borderBottomWidth: 1.5,
          marginBottom: 10,
        }}>
        <Text
          style={
            (styles.subText, {fontFamily: fonts.PPB, fontSize: fontScalling(2)})
          }>
          About
        </Text>
        <Text style={[styles.subText]}>
          The Green Leaf Hotel is a modern 4-star hotel located in the city
          center. It offers comfortable rooms with Wi-Fi, air conditioning, and
          24/7 room service. Guests can enjoy delicious meals at the in-house
          restaurant and rooftop café. Facilities include a swimming pool, gym,
          and spa for relaxation. The hotel also provides business meeting
          spaces and airport transfers. Friendly staff .
        </Text>
      </View>

      {/* coupon Block */}
      <Pressable
        style={{
          marginHorizontal: 20,
          borderBottomColor: appColors.pink,
          borderBottomWidth: 0.8,
          marginBottom: 20,
        }}>
        <Text
          style={{
            fontFamily: fonts.PPR,
            fontSize: fontScalling(2),
            paddingVertical: 5,
          }}>
          Coupons
        </Text>
        {couponsList && couponsList.length > 0 && (
          <FlatList
            scrollEnabled={false}
            data={
              couponsList.length > 3 ? couponsList.slice(0, 3) : couponsList
            }
            renderItem={({item, index}) => {
              return <CouponCard item={item} />;
            }}
          />
        )}
        <Text
          onPress={() => navigation.navigate('couponList')}
          style={
            (styles.subText,
            {
              fontFamily: fonts.PPR,
              fontSize: fontScalling(2.2),
              paddingTop: 15,
              color: appColors.pink,
            })
          }>
          {` View all ${couponsList.length} coupons > `}
        </Text>
      </Pressable>

      {/* Review Sections */}
      <ReviewsSection />
      <Text
        onPress={() => navigation.navigate('reviewList')}
        style={
          (styles.subText,
          {
            fontFamily: fonts.PPR,
            fontSize: fontScalling(2.2),
            paddingTop: 15,
            color: appColors.pink,
            marginHorizontal: 20,
          })
        }>
        {` View all reviews > `}
      </Text>
    </ScrollView>
  );
};

export default MerchantDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.bgWhite,
    flex: 1,
  },
  headerCon: {
    paddingHorizontal: 20,
    paddingBlock: 15,
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
  sheetContent: {flex: 1, padding: 16},
  sectionTitle: {fontWeight: 'bold', fontSize: 16, marginBottom: 10},
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  row: {flexDirection: 'row', alignItems: 'center'},
  itemText: {marginLeft: 8, fontSize: 14, color: '#333'},
});
