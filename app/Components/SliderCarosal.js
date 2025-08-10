import {Image, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import Carousel from 'react-native-reanimated-carousel';

import {scrnHeight, scrnWidth} from '../Utiles/HelperFunction';
import {appColors} from '../Utiles/appColors';

const SliderCarosal = ({data}) => {
  const baseOptions = {
    width: scrnWidth - 40,
    height: scrnHeight / 3.8,
  };
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <View>
      <Carousel
        {...baseOptions}
        loop={true}
        autoPlay={true}
        style={{
          alignSelf: 'center',
          borderRadius: 10,
          overflow: 'hidden',
        }}
        autoPlayInterval={4500}
        data={[1, 2, 3, 4]}
        pagingEnabled={true}
        onSnapToItem={index => setCurrentIndex(index)}
        renderItem={({item, index}) => {
          return (
            <Image
              style={{width: '100%', height: '100%'}}
              source={{uri: data?.merchant_thumbnail_url}}
              resizeMode="cover"
            />
          );
        }}
      />
      {/* Indicator Dots */}
      <View style={styles.indicatorContainer}>
        {[1, 2, 3, 4].map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

export default SliderCarosal;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: scrnHeight / 4,
    borderRadius: 10,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  dot: {
    width: 7,
    height: 5,
    borderRadius: 5,
    backgroundColor: appColors.searchColor,
    marginHorizontal: 4,
    elevation: 2,
  },
  activeDot: {
    backgroundColor: appColors.pink,
    width: 15,
  },
});
