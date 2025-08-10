import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {CouponCard} from '../Components/CouponCard';
import {couponsList} from '../Constants/CouponList';
import {bottom_Height, fontScalling} from '../Utiles/HelperFunction';
import {fonts} from '../Utiles/appFont';
import {appColors} from '../Utiles/appColors';
import HeaderBlock from '../Components/HeaderBlock';

const CouponsListSceen = () => {
  return (
    <View style={{backgroundColor: appColors.bgWhite}}>
      {/* coupon Block */}
      <View style={{marginHorizontal: 20, paddingTop: 20}}>
        <HeaderBlock leftIcon={true} title="Coupons" />
        {couponsList && couponsList.length > 0 && (
          <FlatList
            style={{marginVertical: 20, marginBottom: bottom_Height + 30}}
            showsVerticalScrollIndicator={false}
            data={couponsList.length > 3 ? couponsList : couponsList}
            renderItem={({item, index}) => {
              return <CouponCard item={item} />;
            }}
          />
        )}
      </View>
    </View>
  );
};

export default CouponsListSceen;

const styles = StyleSheet.create({
  subText: {
    color: appColors.textColor,
    fontSize: fontScalling(1.8),
    fontFamily: fonts.PPR,
  },
});
