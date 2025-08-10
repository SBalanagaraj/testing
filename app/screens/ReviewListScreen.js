import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import HeaderBlock from '../Components/HeaderBlock';
import {appColors} from '../Utiles/appColors';
import ReviewsSection from '../Components/ReviewsSection';

const ReviewListScreen = () => {
  return (
    <View style={styles.container}>
      <HeaderBlock title="Reviews & Ratings" leftIcon />
      <ReviewsSection noHead />
    </View>
  );
};

export default ReviewListScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.bgWhite,
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
