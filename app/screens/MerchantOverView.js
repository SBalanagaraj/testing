import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {appColors} from '../Utiles/appColors';
import HeaderBlock from '../Components/HeaderBlock';
import {EvilIcons} from '@react-native-vector-icons/evil-icons';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {Entypo} from '@react-native-vector-icons/entypo';
import {
  bottom_Height,
  fontScalling,
  print,
  scrnHeight,
  widthResponse,
} from '../Utiles/HelperFunction';
import {fonts} from '../Utiles/appFont';
import SearchBlock from '../Components/SearchBlock';
import {merchantOverview} from '../api/Merchant';
import filter from 'lodash.filter';
import {useSelector} from 'react-redux';

const MerchantOverView = ({navigation}) => {
  const [merchants, setMerchants] = useState([]);
  const [catogary, setCatogary] = useState([
    {
      category_id: 'all',
      category_name: 'All',
    },
  ]);
  const [load, setLoad] = useState(false);
  const [catId, setCatId] = useState('');
  const [filteredList, setFilteredList] = useState([]);

  const flatListRef = useRef(null);

  const {userLocation} = useSelector(state => state.setting);

  print(userLocation, 'userLocation');

  // api Fetch Data;
  useEffect(() => {
    (async () => {
      setLoad(true);
      const res = await merchantOverview();
      if (res && res.success) {
        setCatogary([...catogary, ...res?.data?.data?.data?.categories]);
        setMerchants(res?.data?.data?.data?.merchants);
      }
      setLoad(false);
    })();
  }, []);

  const catFilter = (cat_Id = '') => {
    setCatId(cat_Id);
  };

  // Id Based catogary filter
  useEffect(() => {
    setFilteredList(
      catId && catId != '' && catId != 'all'
        ? merchants.filter(dta =>
            dta.categories.some(data => data.category_id == catId),
          )
        : merchants,
    );
  }, [catId, merchants]);

  const serchFn = async term => {
    const filterList = filter(merchants, item => {
      // print(item, 'item');
      console.log(term, 'term');
      if (term && typeof term != 'string') return false;
      console.log(item.merchant_name, 'item.merchant_name');
      const filterData =
        item && item?.merchant_name?.toLowerCase().includes(term.toLowerCase());
      return filterData;
    });
    setFilteredList(filterList);
  };

  // scrollToIndex
  const scrollToIndex = index => {
    flatListRef?.current?.scrollToIndex({index, animated: true});
  };
  //catogary component
  const CatogaryBlock = ({data, ind}) => {
    return (
      <Pressable
        onPress={() => {
          scrollToIndex(ind);
          catFilter(data.category_id);
        }}
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          borderRadius: 20,
          borderWidth: 1,
          borderColor: appColors.borderPink,
          alignItems: 'center',
          paddingHorizontal: 15,
          paddingVertical: 10,
          backgroundColor:
            catId == data.category_id ? appColors.pink : appColors.bgWhite,
          elevation: 0.2,
          shadowColor: appColors.pink,
          marginRight: 15,
        }}>
        <Text
          style={{
            fontSize: fontScalling(2),
            fontFamily: fonts.PPR,
            color:
              catId == data.category_id
                ? appColors.bgWhite
                : appColors.textColor,
            marginRight: 10,
            // lineHeight: fontScalling(2),
          }}>
          {data?.category_name}
        </Text>
        <Entypo
          name="plus"
          size={fontScalling(2.5)}
          color={
            catId == data.category_id ? appColors.bgWhite : appColors.textColor
          }
          style={{alignSelf: 'center'}}
        />
      </Pressable>
    );
  };

  // Merchants List
  const MerchahantsList = ({data = {}, ind = ''}) => {
    return (
      <Pressable
        onPress={() =>
          navigation.navigate('MerchantDetails', {
            data: data,
          })
        }
        style={{
          borderRadius: 15,
          overflow: 'hidden',
          marginHorizontal: 20,
          marginBottom: 15,
          borderWidth: 1.5,
          borderColor: appColors.borderPink,
          backgroundColor: appColors.background,
          elevation: 5,
          shadowColor: appColors.pink,
        }}>
        <Image
          style={{width: '100%', height: scrnHeight / 4}}
          source={{uri: data?.merchant_thumbnail_url}}
          resizeMode="cover"
        />
        {/* Rating Badge */}
        {data?.avg_rating > 0 && (
          <View
            style={[
              styles.flexRow,
              {
                position: 'absolute',
                backgroundColor: appColors.bgWhite,
                top: 10,
                left: 10,
                borderRadius: 15,
                paddingHorizontal: 5,
                paddingVertical: 5,
                shadowColor: appColors.placeHolderClr,
                borderWidth: 0.2,
                borderColor: appColors.placeHolderClr,
              },
            ]}>
            <MaterialIcons name={'star-rate'} size={20} color={'gold'} />
            <Text style={styles.locText}>{data.avg_rating}</Text>
          </View>
        )}
        <View
          style={[
            styles.flexRow,
            {
              backgroundColor: appColors.pink,
              paddingHorizontal: 20,
              paddingVertical: 8,
            },
          ]}>
          <EvilIcons
            name="location"
            size={widthResponse ? 22 : 30}
            color={appColors.bgWhite}
            style={{marginLeft: -5}}
          />
          <Text
            style={[
              styles.locText,
              {color: appColors.bgWhite},
            ]}>{`${data.merchant_name} , ${data?.default_outlet?.outlet_loction_name}`}</Text>
        </View>
        <View
          style={[
            styles.flexRow,
            {
              backgroundColor: appColors.bgWhite,
              paddingHorizontal: 20,
              paddingVertical: 8,
              alignItems: 'flex-start',
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
                  fontSize: fontScalling(2),
                  fontFamily: fonts.PPSM,
                  fontWeight: '700',
                },
              ]}>{`Green Leaf Restaurant`}</Text>
            <Text
              style={{
                color: appColors.textColor,
                fontSize: fontScalling(1.5),
                fontFamily: fonts.PPSM,
              }}>
              {data?.categories.map(
                (dta, ind) =>
                  `${dta?.category_name} ${
                    ind > 0 && catogary.length - 1 !== ind ? ',' : ''
                  } `,
              )}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Block */}
      <View style={styles.headerCon}>
        <HeaderBlock title="Merchants" />
        {/* location Navigate */}
        <Pressable
          onPress={() => {
            navigation.navigate('location');
          }}
          style={styles.locationBlock}>
          <EvilIcons
            name="location"
            size={widthResponse ? 22 : 30}
            color={appColors.black}
            style={{marginLeft: -5}}
          />
          <Text style={[styles.locText, {flex: 0.8}]}>
            {userLocation && Object.keys(userLocation).length > 0
              ? userLocation.address && userLocation.address != ''
                ? userLocation.address
                : `${userLocation.street},${userLocation?.city}`
              : 'Update Your Location'}
          </Text>
          <Entypo
            name="chevron-small-right"
            size={widthResponse ? 25 : 30}
            color={appColors.black}
          />
        </Pressable>
        {/* Search Block */}
        <SearchBlock srchFn={serchFn} />
      </View>
      {/* Activity Loader*/}
      {load && (
        <View
          style={[
            styles.container,
            {alignItems: 'center', justifyContent: 'center', flex: 1},
          ]}>
          <ActivityIndicator size={'large'} color={appColors.pink} />
        </View>
      )}
      <View>
        {/* catogart */}
        {!load && catogary && catogary.length > 0 && (
          <FlatList
            ref={flatListRef}
            showsHorizontalScrollIndicator={false}
            style={{paddingBottom: 15, marginLeft: 20}}
            horizontal={true}
            data={catogary}
            renderItem={({item, index}) => (
              <CatogaryBlock data={item} ind={index} />
            )}
          />
        )}

        {filteredList && filteredList.length > 0 ? (
          <FlatList
            style={{marginBottom: bottom_Height + 200}}
            data={filteredList}
            renderItem={({item, index}) => (
              <MerchahantsList data={item} ind={index} />
            )}
          />
        ) : (
          !load && (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                paddingTop: 140,
              }}>
              <Text style={styles.locText}>Merchant's Not Found</Text>
              <Image
                style={{width: 100, height: 100, marginTop: 40}}
                source={require('../assets/Image/search.png')}
              />
            </View>
          )
        )}
      </View>
    </View>
  );
};

export default MerchantOverView;

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.bgWhite,
    flex: 1,
  },
  headerCon: {
    paddingHorizontal: 20,
    paddingBlock: 15,
  },
  locationBlock: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingBlock: 5,
    paddingBottom: 10,
  },
  locText: {
    color: appColors.textColor,
    fontFamily: fonts.PPR,
    fontSize: fontScalling(1.8),
    paddingHorizontal: 5,
  },
  flexRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});
