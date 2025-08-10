import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {fontScalling, widthResponse} from '../Utiles/HelperFunction';
import {appColors} from '../Utiles/appColors';
import {fonts} from '../Utiles/appFont';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';

export const CouponCard = ({item}) => {
  const styles = useStyles();

  return (
    <View
      style={{
        marginBottom: 10,
      }}>
      <View
        // key={item.id}
        style={{
          borderRadius: 15,
          flexDirection: 'row',
          overflow: 'hidden',
          justifyContent: 'center',
        }}>
        {/* ball style */}
        <View
          style={{
            position: 'absolute',
            height: '100%',
            justifyContent: 'center',
            left: widthResponse ? -5 : -6,
            zIndex: 100,
          }}>
          {[0, 1, 2, 3, 4, 5].map((data, i) => (
            <View
              key={i}
              style={{
                padding: widthResponse ? 7 : 6,
                marginBottom: i == 5 ? 0 : widthResponse ? 6 : 10,
                borderRadius: 20,
                backgroundColor: appColors.bgWhite,
              }}
            />
          ))}
        </View>
        {/* offer */}
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: appColors.pink,
            width: '25%',
          }}>
          <Text
            style={[
              styles.head,
              {
                transform: [{rotate: '-90deg'}],
              },
            ]}>
            {item.tag}
          </Text>
        </View>
        {/* coupen detail */}
        <View
          style={{
            flex: 1,
            borderWidth: 1,
            borderLeftWidth: 0,
            borderColor: appColors.borderPink,
            borderTopRightRadius: 15,
            borderBottomRightRadius: 15,
            alignItems: 'flex-start',
            backgroundColor: appColors.bgWhite,
            padding: widthResponse ? 10 : 15,
            paddingVertical: false
              ? widthResponse
                ? 10
                : 15
              : widthResponse
              ? 25
              : 35,
          }}>
          {/* top block */}
          <View
            style={{
              //   flex: 1,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Image
              resizeMode="cover"
              source={item.logo}
              style={{width: 30, height: 30, borderRadius: 30}}
            />
            <Text
              style={[
                {
                  color: appColors.black,
                  fontFamily: fonts.PPB,
                  fontSize: fontScalling(2),
                  marginLeft: 10,
                },
              ]}>
              {item.brand}
            </Text>
            <TouchableOpacity style={{marginLeft: 'auto'}}>
              <Text
                style={[
                  styles.subHead,
                  {color: appColors.pink, fontFamily: fonts.PPB},
                ]}>
                {'Claim Now'}
              </Text>
            </TouchableOpacity>
            {/* {applied && (
            )} */}
          </View>
          <Text style={[styles.para, {fontFamily: fonts.PPSM}]}>
            {item.title}
          </Text>
          <Text style={[styles.para]}>{item.description}</Text>
          <Text style={[styles.para, {color: appColors.textLight}]}>
            {item.instruction}
          </Text>

          <View
            style={{
              borderWidth: 2,
              borderStyle: 'dashed',
              borderColor: appColors.borderPink,
              paddingHorizontal: 20,
              paddingVertical: 5,
              borderRadius: 5,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <MaterialDesignIcons
              name="content-copy"
              size={18}
              color={appColors.borderPink}
            />
            <Text
              style={[
                styles.subHead,
                {color: appColors.pink, fontFamily: fonts.PPM, paddingLeft: 10},
              ]}>
              {item.code}
            </Text>
          </View>

          {/* bottom blk */}
          {
            <View
              style={{
                width: '100%',
                marginTop: widthResponse ? 8 : 12,
                paddingTop: widthResponse ? 8 : 12,
              }}>
              <Text>
                {`offer ends in `}
                <Text style={[styles.para, {color: appColors.pink}]}>
                  {item.expiry}
                </Text>
              </Text>
            </View>
          }
        </View>
      </View>
    </View>
  );
};

const useStyles = () => {
  const styles = StyleSheet.create({
    head: {
      fontFamily: fonts.PPB,
      fontSize: fontScalling(1.9),
      color: appColors.bgWhite,
    },
    subHead: {
      fontFamily: fonts.PPL,
      fontSize: fontScalling(1.7),
      color: appColors.black,
    },
    para: {
      fontFamily: fonts.PPR,
      fontSize: fontScalling(1.6),
      color: appColors.black,
    },
  });
  return styles;
};
