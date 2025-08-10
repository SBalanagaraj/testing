// components/ReviewsSection.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {ratingsSummary, reviews} from '../Constants/CouponList';
import {fontScalling, scrnWidth} from '../Utiles/HelperFunction';
import {appColors} from '../Utiles/appColors';
import {fonts} from '../Utiles/appFont';
import {useNavigation} from '@react-navigation/native';

export default function ReviewsSection({noHead = false}) {
  const navigation = useNavigation();

  const getBarWidth = count => {
    const maxCount = Math.max(...Object.values(ratingsSummary.breakdown));
    return (count / maxCount) * (scrnWidth / 2);
  };

  const renderStars = count => {
    return [...Array(5)].map((_, index) => (
      <Icon
        key={index}
        name={index < count ? 'star' : 'star-outline'}
        size={16}
        color="#FFD700"
      />
    ));
  };

  const renderReviewItem = ({item}) => (
    <Pressable
      onPress={() => navigation.navigate('addReview', {item: item, edit: true})}
      style={styles.reviewItem}>
      <Image source={{uri: item.avatar}} style={styles.avatar} />
      <View style={{flex: 1}}>
        <View style={styles.reviewHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
        <View style={{flexDirection: 'row', marginVertical: 4}}>
          {renderStars(item.rating)}
        </View>
        <Text style={styles.comment}>{item.comment}</Text>
      </View>
      <View style={styles.likeContainer}>
        <Text style={styles.likeText}>{item.likes}</Text>
        <Icon name="heart-outline" size={18} color="#f33" />
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* Summary */}
      {!noHead && (
        <View style={styles.summaryRow}>
          <Text style={styles.title}>Ratings and Reviews</Text>
          <TouchableOpacity onPress={() => navigation.navigate('addReview')}>
            <Text style={styles.addReview}>Add Review</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={[styles.summary]}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={[
              {
                flexDirection: 'row',
                backgroundColor: appColors.bgWhite,
                paddingHorizontal: 5,
                paddingVertical: 5,
                paddingRight: '10%',
              },
            ]}>
            <MaterialIcons name={'star-rate'} size={20} color={'gold'} />
            <Text style={styles.average}>{ratingsSummary.average}</Text>
          </View>
          <Text
            style={[
              styles.average,
              {fontSize: fontScalling(1.5)},
            ]}>{`( ${ratingsSummary.totalReviews} Reviews)`}</Text>
        </View>

        <View>
          {Object.entries(ratingsSummary.breakdown)
            .sort((a, b) => b[0] - a[0])
            .map(([stars, count]) => (
              <View style={styles.barRow} key={stars}>
                <Text style={styles.starLabel}>{stars}</Text>
                <View style={styles.barBackground}>
                  <View style={[styles.barFill, {width: getBarWidth(count)}]} />
                </View>
              </View>
            ))}
        </View>
      </View>

      {/* Reviews List */}
      <FlatList
        data={reviews}
        keyExtractor={item => item.id.toString()}
        renderItem={renderReviewItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {padding: 12, backgroundColor: '#fff'},
  summaryRow: {flexDirection: 'row', justifyContent: 'space-between'},
  title: {
    fontSize: fontScalling(2),
    color: appColors.textColor,
    fontWeight: 'bold',
    fontFamily: fonts.PPSM,
  },
  addReview: {color: '#ff3366', fontWeight: '500'},
  summary: {flexDirection: 'row', alignItems: 'center', marginVertical: 10},
  average: {
    fontSize: fontScalling(2.5),
    color: '#333',
    marginRight: 15,
    fontFamily: fonts.PPM,
  },
  barRow: {flexDirection: 'row', alignItems: 'center', marginVertical: 2},
  starLabel: {width: 20, fontSize: 12},
  barBackground: {
    height: 6,
    backgroundColor: '#ddd',
    borderRadius: 3,
    flex: 1,
    marginHorizontal: 5,
  },
  barFill: {
    height: 6,
    backgroundColor: '#ffcc00',
    borderRadius: 3,
  },
  reviewItem: {flexDirection: 'row', paddingVertical: 10},
  avatar: {width: 35, height: 35, borderRadius: 50, marginRight: 10},
  reviewHeader: {flexDirection: 'row', justifyContent: 'space-between'},
  name: {fontWeight: '600', fontSize: fontScalling(2), fontFamily: fonts.PPM},
  date: {fontSize: 12, color: '#777'},
  comment: {fontSize: 13, color: '#555', marginTop: 4},
  likeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  likeText: {fontSize: 12, color: '#f33'},
  viewAll: {alignItems: 'center', marginTop: 10},
  viewAllText: {color: '#ff3366', fontWeight: '500'},
});
